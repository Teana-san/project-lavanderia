/* Menú móvil */
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuIcon = document.getElementById("mobile-menu-icon");

if (mobileMenuButton && mobileMenu && mobileMenuIcon) {
    mobileMenuButton.addEventListener("click", () => {
        const isHidden = mobileMenu.classList.toggle("hidden");
        mobileMenuButton.setAttribute("aria-expanded", String(!isHidden));
        mobileMenuIcon.textContent = isHidden ? "menu" : "close";
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            mobileMenu.classList.add("hidden");
            mobileMenuButton.setAttribute("aria-expanded", "false");
            mobileMenuIcon.textContent = "menu";
        }
    });
}

/* APARIENCIA DEL MENU DE NAVIGACION AL HACER SCROLL UP */
let lastScrollTop = 0;
const header = document.getElementById('main-header');
const delta = 5;

window.addEventListener('scroll', function () {
    let st = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(lastScrollTop - st) <= delta) return;

    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('mobile-menu-icon');

    if (st > lastScrollTop && st > 80) {
        header.classList.remove('nav-down');
        header.classList.add('nav-up');

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (menuIcon) menuIcon.textContent = 'menu';
        }
    } else {
        header.classList.remove('nav-up');
        header.classList.add('nav-down');
    }

    lastScrollTop = st;
});


/* Cargar más casos */
const loadMoreCasesButton = document.getElementById("load-more-cases");
const extraCases = document.querySelectorAll(".extra-case");

if (loadMoreCasesButton && extraCases.length) {
    loadMoreCasesButton.addEventListener("click", () => {
        extraCases.forEach((item) => item.classList.remove("hidden"));
        loadMoreCasesButton.classList.add("hidden");
    });
}



/* Scroll reveal animations */
document.documentElement.classList.add("js");

const animatedElements = document.querySelectorAll(".animate-on-scroll");

if (animatedElements.length) {
    const revealElement = (element) => {
        const animationName = element.dataset.animation || "fadeInUp";
        const delay = Number(element.dataset.delay || 0);

        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = "1.5s";
        element.classList.add("animated-in");
        element.classList.add("animate__animated", `animate__${animationName}`);
        element.classList.add(`aos-${animationName}`);
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    revealElement(entry.target);
                    currentObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.01,
                rootMargin: "0px 0px 100px 0px",
            }
        );

        animatedElements.forEach((element) => observer.observe(element));
    } else {
        animatedElements.forEach(revealElement);
    }
}

/* Nav underline */
document.querySelectorAll(".nav-underline").forEach((el) => {
    const edgeFromEvent = (e, node) => {
        const r = node.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;

        const distances = {
            left: x,
            right: r.width - x,
            top: y,
            bottom: r.height - y,
        };

        return Object.keys(distances).reduce((closest, key) =>
            distances[key] < distances[closest] ? key : closest
        );
    };

    const setState = (phase, side) => {
        el.classList.remove("is-entering", "is-leaving");
        el.dataset.enter = "";
        el.dataset.leave = "";

        if (phase === "enter") {
            el.dataset.enter = side;
            el.classList.add("is-entering");
        } else {
            el.dataset.leave = side;
            el.classList.add("is-leaving");
        }
    };

    el.addEventListener("mouseenter", (e) => {
        setState("enter", edgeFromEvent(e, el));
    });

    el.addEventListener("mouseleave", (e) => {
        setState("leave", edgeFromEvent(e, el));
    });

    // Accesibilidad teclado: comportamiento centrado
    el.addEventListener("focus", () => setState("enter", "top"));
    el.addEventListener("blur", () => setState("leave", "bottom"));
});


/* МЫЛЬНЫЕ ПУЗЫРИ */
(function () {
    const canvas = document.getElementById('soap-bubbles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    // Создаем массив пузырей
    const bubblesCount = 25;
    const bubbles = Array.from({ length: bubblesCount }, () => createBubble(true));

    function createBubble(randomY = false) {
      const radius = Math.random() * 18 + 10; // Размер
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + radius + Math.random() * 50,
        radius: radius,
        speed: Math.random() * 0.8 + 0.4, // Скорость подъема
        swing: Math.random() * 0.02, // Покачивание влево-вправо
        swingAngle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.3
      };
    }

    function drawBubble(b) {
      ctx.save();
      ctx.globalAlpha = b.opacity;

      // 1. Отрисовка объёмной сферы с градиентом
      const gradient = ctx.createRadialGradient(
        b.x - b.radius * 0.3,
        b.y - b.radius * 0.3,
        b.radius * 0.1,
        b.x,
        b.y,
        b.radius
      );

      // Цвета переливов (светло-голубой, фиолетовый отблеск и белый блик)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.2, 'rgba(191, 219, 254, 0.6)');
      gradient.addColorStop(0.6, 'rgba(147, 197, 253, 0.2)');
      gradient.addColorStop(0.9, 'rgba(168, 85, 247, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 2. Добавляем тонкий глянцевый блик
      ctx.beginPath();
      ctx.arc(b.x - b.radius * 0.35, b.y - b.radius * 0.35, b.radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();

      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      bubbles.forEach((b, index) => {
        b.y -= b.speed;
        b.swingAngle += b.swing;
        b.x += Math.sin(b.swingAngle) * 0.5;

        // Если пузырь улетел наверх — пересоздаем снизу
        if (b.y < -b.radius) {
          bubbles[index] = createBubble(false);
        }

        drawBubble(b);
      });

      requestAnimationFrame(animate);
    }

    animate();
  })();


/* FORM TO EMAIL */
document.addEventListener("DOMContentLoaded", function () {
    const RECAPTCHA_SITE_KEY = '6LcJKm0tAAAAAF_nzMAxx9kZkPgmae0K79ewjcf_';

    const allForms = document.querySelectorAll('form');

    allForms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('input', function () {
                const fieldGroup = this.closest('.field-group');
                if (fieldGroup) {
                    const errorMsg = fieldGroup.querySelector('.error-msg');
                    if (errorMsg) errorMsg.classList.add('hidden');
                }
                this.classList.remove('border-red-500');
            });
        });

        // Обработка отправки
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const currentForm = this;
            const submitBtn = currentForm.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const icon = submitBtn.querySelector('.material-icons-outlined');
            const originalText = btnText ? btnText.innerText : 'Enviar';

            // Сброс видимости предыдущих ошибок
            currentForm.querySelectorAll('.error-msg').forEach(msg => msg.classList.add('hidden'));
            currentForm.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('border-red-500'));

            // Блокировка кнопки на время отправки
            submitBtn.disabled = true;
            if (btnText) btnText.innerText = 'Enviando...';
            if (icon) icon.innerText = 'refresh';

            // Генерация токена reCAPTCHA
            grecaptcha.ready(function () {
                grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' }).then(function (token) {
                    
                    const formData = new FormData(currentForm);
                    formData.append('recaptcha_token', token);

                    // Путь к универсальному скрипту
                    const fetchUrl = `${window.location.origin}/send_form.php`;

                    fetch(fetchUrl, {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.type === 'success') {
                            currentForm.innerHTML = `
                                <div class="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                                    <h3 class="text-2xl font-bold text-primary mb-2">¡Enviado con éxito!</h3>
                                    <p class="text-slate-300 max-w-xs">${data.message}</p>
                                    <button onclick="location.reload()" class="mt-6 text-secondary hover:underline text-sm">
                                        Enviar otro mensaje
                                    </button>
                                </div>
                            `;
                        } else if (data.type === 'error' && data.errors) {
                            Object.entries(data.errors).forEach(([field, message]) => {
                                if (!message) return;

                                const errorDisplay = currentForm.querySelector(`#error-${field}`);
                                const inputElement = currentForm.querySelector(`[name="${field}"]`);

                                if (errorDisplay) {
                                    errorDisplay.textContent = message;
                                    errorDisplay.classList.remove('hidden');
                                }
                                if (inputElement) {
                                    inputElement.classList.add('border-red-500');
                                }
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error de conexión con el servidor.');
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        if (btnText) btnText.innerText = originalText;
                        if (icon) icon.innerText = 'send';
                    });
                });
            });
        });
    });
});