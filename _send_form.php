<?php

// Функция для чтения файла .env
function loadEnv(string $path): void
{
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue; // Игнорируем комментарии и пустые строки
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $_ENV[trim($name)] = trim($value);
        }
    }
}

loadEnv(__DIR__ . '/.env');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

$secretKey = $_ENV['RECAPTCHA_SECRET_KEY'] ?? '';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Obtener y sanitizar los datos del formulario
    $formType = $_POST['form_type'] ?? 'desconocido';

    // Dinámico según el formulario enviado
    if ($formType === 'presupuesto_rapido') {
        $subject = "Solicitud Nueva: Presupuesto Rápido";
    } elseif ($formType === 'solicitud_detallada') {
        $subject = "Solicitud Nueva: Consulta Detallada";
    } else {
        $subject = "Nuevo mensaje desde la web";
    }

    $name           = trim($_POST['name'] ?? '');
    $email          = trim($_POST['email'] ?? '');
    $phone          = trim($_POST['phone'] ?? '');
    $empresa        = trim($_POST['empresa'] ?? '');
    $message        = trim($_POST['message'] ?? '');
    $politica       = $_POST['politica'] ?? '';
    $recaptchaToken = $_POST['recaptcha_token'] ?? '';

    $errors = [];

    // Validaciones
    if (empty($politica)) {
        $errors['politica'] = "Por favor, acepta la Política de Privacidad";
    }

    if (empty($name)) {
        $errors['name'] = "El nombre es obligatorio";
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = "El email debe ser válido";
    }

    // Validar teléfono (entre 9 y 15 dígitos)
    if (empty($phone)) {
        $errors['phone'] = "El teléfono es obligatorio";
    } elseif (!preg_match('/^[0-9]{9,15}$/', preg_replace('/\s+/', '', $phone))) {
        $errors['phone'] = "El teléfono debe ser válido (9 dígitos)";
    }

    // Validar sector/empresa en el primer formulario
    if ($formType === 'presupuesto_rapido' && empty($empresa)) {
        $errors['empresa'] = "Por favor, selecciona un sector";
    }

    // Validar mensaje obligatorio solo en el segundo formulario
    if ($formType === 'solicitud_detallada' && empty($message)) {
        $errors['message'] = "El mensaje es obligatorio";
    }

    // Validar reCAPTCHA v3
    if (empty($recaptchaToken)) {
        $errors['recaptcha'] = "Fallo en la validación del reCAPTCHA.";
    } else {
        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = [
            'secret'   => $secretKey,
            'response' => $recaptchaToken
        ];

        $options = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                'method'  => 'POST',
                'content' => http_build_query($data)
            ]
        ];
        $context  = stream_context_create($options);
        $response = file_get_contents($url, false, $context);
        $responseKeys = json_decode($response, true);

        if (!$responseKeys['success'] || ($responseKeys['score'] ?? 0) < 0.5) {
            $errors['recaptcha'] = "La validación de seguridad falló.";
        }
    }

    // Si hay errores, enviarlos directamente como clave => valor
    if (!empty($errors)) {
        header('Content-Type: application/json');
        echo json_encode([
            'type'   => 'error',
            'errors' => $errors
        ]);
        exit;
    }

    // Configuración del correo
    $isLocalhost = ($_SERVER['SERVER_NAME'] === 'localhost' || $_SERVER['SERVER_NAME'] === '127.0.0.1');

    if ($isLocalhost) {
        // На локалке имитируем успешную отправку
        $mailSent = true;
    } else {
        $mail = new PHPMailer(true);

        try {
            // Настройки сервера Gmail
            $mail->isSMTP();
            $mail->Host       = $_ENV['SMTP_HOST'];
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['SMTP_USER'];
            $mail->Password   = $_ENV['SMTP_PASS'];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = (int)$_ENV['SMTP_PORT'];
            $mail->CharSet    = 'UTF-8';

            // От кого и Кому
            $mail->setFrom($_ENV['SMTP_USER'], 'Lavanderia Eduardo Web');
            $mail->addAddress($_ENV['SMTP_USER']);

            // Поле "Ответить"
            $mail->addReplyTo($email, $name);

            // Содержание письма
            $mail->isHTML(false);
            $mail->Subject = $subject . " - " . $name; // Используем динамическую тему из начала файла!

            $mail->Body  = "Has recibido un nuevo mensaje desde la web:\n\n";
            $mail->Body .= "Nombre: $name\n";
            $mail->Body .= "Teléfono: $phone\n";
            $mail->Body .= "Email: $email\n";

            if (!empty($empresa)) {
                $mail->Body .= "Sector/Empresa: $empresa\n";
            }
            if (!empty($message)) {
                $mail->Body .= "Mensaje: $message\n";
            }

            $mail->send();
            $mailSent = true;
        } catch (Exception $e) {
            error_log('PHPMailer error: ' . $mail->ErrorInfo);
            $mailSent = false;
        }
    }

    // 4. Отдаем JSON на фронтенд
    if ($mailSent) {
        header('Content-Type: application/json');
        echo json_encode([
            'type'    => 'success',
            'message' => '¡El mensaje se envió correctamente!'
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode([
            'type'    => 'error',
            'message' => 'Hubo un error al enviar el mensaje.'
        ]);
    }
    exit;
} else {
    echo "Método no permitido.";
}
