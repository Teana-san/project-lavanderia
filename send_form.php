<?php

// Clave secreta de reCAPTCHA
$secretKey = "6LcJKm0tAAAAAEGyFPjhyWQ9KMeEA8AoD42pJqjE";

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

    $name     = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email    = htmlspecialchars(trim($_POST['email'] ?? ''));
    $phone    = htmlspecialchars(trim($_POST['phone'] ?? ''));
    $empresa  = htmlspecialchars(trim($_POST['empresa'] ?? ''));
    $message  = htmlspecialchars(trim($_POST['message'] ?? ''));
    $politica = $_POST['politica'] ?? '';
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
    $to = "teana318san@gmail.com";

    $body  = "Has recibido un nuevo mensaje desde el sitio web:\n";
    $body .= "Origen: " . ($formType === 'presupuesto_rapido' ? 'Formulario Rápido' : 'Formulario Detallado') . "\n\n";
    $body .= "Nombre: $name\n";
    $body .= "Empresa / Sector: " . ($empresa ? $empresa : 'No especificado') . "\n";
    $body .= "Email: $email\n";
    $body .= "Teléfono: $phone\n";
    
    if (!empty($message)) {
        $body .= "Mensaje: $message\n";
    }

    // Headers
    $headers  = "From: no-reply@lavanderia.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $body, $headers)) {
        header('Content-Type: application/json');
        echo json_encode([
            'type'    => 'success',
            'message' => '¡El mensaje se envió correctamente! Nos pondremos en contacto contigo pronto.'
        ]);
    } else {
        header('Content-Type: application/json');
        echo json_encode([
            'type'    => 'error',
            'message' => 'Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde.'
        ]);
    }
    exit;
} else {
    echo "Método no permitido.";
}