/* ==========================================================================
   i18n.js — простой переключатель языка ES / EN без фреймворков.
   Как это работает:
   1. В HTML у переводимых элементов стоит атрибут data-i18n="ключ.вложенный".
      Для элементов, где нужно сохранить вложенную разметку (например <br>
      или вложенный <span> с другим цветом), используется data-i18n-html.
   2. Для placeholder'ов инпутов — data-i18n-placeholder="ключ".
   3. Для content у мета-тегов — data-i18n-content="ключ".
   4. Язык хранится в localStorage (ключ "site_lang"), по умолчанию — "es".
   5. window.i18n.t(key) возвращает перевод по ключу — используется в
      script.js для сообщений/ошибок, которые генерируются динамически.
   ========================================================================== */

(function () {
    const STORAGE_KEY = "site_lang";
    const DEFAULT_LANG = "es";

    const dict = {
        es: {
            meta: {
                title: "Lavandería Industrial para Restaurantes | Vega Baja (Alicante)",
                description: "Lavandería industrial en Formentera del Segura y Vega Baja (Alicante). Mantelería para restaurantes y textil para hostelería. +20 años, recogida y entrega gratis en 24/48h."
            },
            brand: {
                nameHeader: 'Maiti<span class="text-primary">2</span>Wash',
                nameFooter: 'Maiti<span class="text-secondary">2</span>Wash'
            },
            nav: {
                inicio: "Inicio",
                servicios: "Servicios",
                contacto: "Contacto",
                cta: "Presupuesto Gratis",
                ctaLong: "Solicitar Tarifa B2B"
            },
            hero: {
                title: 'Servicio de Lavandería Profesional <br class="hidden md:inline"> para Hoteles y Restaurantes',
                subtitle: "Más de 20 años cuidando el textil de los negocios locales. Recogida y entrega gratuita en 24/48 horas con la máxima garantía de higiene.",
                ctaServices: "Nuestros Servicios"
            },
            banners: {
                experience: "Años de Experiencia",
                pickup: "Recogida y Entrega Gratis",
                specialists: "Especialistas en Empresas"
            },
            form1: {
                title: "Presupuesto Rápido en 24h",
                subtitle: "Completa este formulario y nuestro equipo se pondrá en contacto contigo.",
                submit: "Solicitar Presupuesto"
            },
            form: {
                namePlaceholder: "Nombre y apellidos *",
                phonePlaceholder: "Teléfono *",
                emailPlaceholder: "Email corporativo *",
                sectorPlaceholder: "¿Qué tipo de negocio tienes? *",
                sector1: "Hostelería y Restauración",
                sector2: "Hoteles y Alojamientos",
                sector3: "Apartamentos Turísticos / Airbnb",
                sector4: "Gimnasios, Spas y Centros de Estética",
                sector5: "Otro tipo de empresa",
                privacyPrefix: "He leído y acepto la",
                privacyLink: "Política de Privacidad"
            },
            services: {
                title: "Soluciones Textiles para su Negocio",
                subtitle: "Ofrecemos un servicio integral adaptado a las necesidades y normativas sanitarias vigentes para cada sector industrial.",
                card1: {
                    title: "Hostelería y Restauración",
                    desc: "Tratamiento especializado para eliminar manchas difíciles de grasa y vino en manteles y servilletas.",
                    item1: "Mantelerías y caminos de mesa",
                    item2: "Servilletas de tela",
                    item3: "Uniformes de cocina y sala"
                },
                card2: {
                    title: "Hoteles y Hostales",
                    desc: "Garantizamos un planchado perfecto y una blancura impecable que mejorará la experiencia de sus huéspedes.",
                    item1: "Sábanas y fundas de almohada",
                    item2: "Toallas de alto gramaje",
                    item3: "Edredones y protectores"
                },
                card3: {
                    title: "Apartamentos Turísticos",
                    desc: "Servicio ágil y flexible adaptado a los días de entrada y salida de inquilinos (Airbnb, Booking).",
                    item1: "Lavado rápido express",
                    item2: "Kits de ropa por huésped",
                    item3: "Control estricto de taras"
                }
            },
            about: {
                title: "Más de Dos Décadas de Confianza",
                subtitle: "Una empresa familiar al servicio del negocio local",
                p1: "Fundada hace más de 20 años, nuestra lavandería industrial combina la experiencia tradicional con la tecnología más avanzada del sector para ofrecer acabados e higiene impecables.",
                p2: "Entendemos que la presentación textil es la carta de presentación de su restaurante u hotel. Ofrecemos un trato directo, sin intermediarios, garantizando máxima puntualidad en cada entrega.",
                feature1: "Servicio Personalizado",
                feature2: "Control de Calidad",
                badgeTitle: "Garantía de Higiene",
                badgeDesc: "Procesos certificados para hostelería"
            },
            reviews: {
                title: "Nuestros clientes nos recomiendan en Google",
                basedOn: "Basado en 30 reseñas",
                roleB2B: "Cliente B2B",
                roleApts: "Apartamentos Turísticos",
                roleGuide: "Local Guide",
                placeholderQuote: "\u201cTexto de la reseña.\u201d",
                seeAll: "Ver todas las reseñas en Google"
            },
            contact: {
                title: "Solicita una Consulta Detallada",
                subtitle: "Déjenos sus datos y nos pondremos en contacto para ofrecerle una tarifa adaptada al volumen de su empresa.",
                form: {
                    nameLabel: "Nombre y Apellidos *",
                    namePlaceholder: "Ej. Juan Pérez",
                    companyLabel: "Nombre de la Empresa",
                    companyPlaceholder: "Ej. Restaurante Mar Azul",
                    phoneLabel: "Teléfono de Contacto *",
                    phonePlaceholder: "Ej. 600 000 000",
                    emailLabel: "Correo Electrónico *",
                    emailPlaceholder: "ejemplo@empresa.com",
                    messageLabel: "Mensaje / Necesidades específicas",
                    messagePlaceholder: "Cuéntenos cuántos kilos o piezas estima a la semana...",
                    submit: "Enviar Solicitud"
                },
                info: {
                    locationTitle: "Ubicación",
                    phoneTitle: "Teléfono Comercial",
                    hoursTitle: "Horario de Atención",
                    hoursValue: "Lunes a Viernes: 09:00 - 14:00"
                }
            },
            footer: {
                tagline: "Optimizamos la gestión de textil para tu empresa con soluciones de lavado industrial de alta eficiencia.",
                highlights: "Destacados",
                sendRequest: "Enviar Solicitud",
                legal: "Legal",
                legalNotice: "Aviso Legal",
                cookiePolicy: "Política de Cookies",
                contactTitle: "Contacto",
                copyright: "\u00A9 2026 Lavandería Industrial. Todos los derechos reservados."
            },
            messages: {
                sending: "Enviando...",
                successTitle: "¡Enviado con éxito!",
                sendAnother: "Enviar otro mensaje",
                connectionError: "Error de conexión con el servidor.",
                send_success: "¡El mensaje se envió correctamente!",
                send_error: "Hubo un error al enviar el mensaje."
            },
            errors: {
                required_privacy: "Por favor, acepta la Política de Privacidad",
                required_name: "El nombre es obligatorio",
                invalid_email: "El email debe ser válido",
                required_phone: "El teléfono es obligatorio",
                invalid_phone: "El teléfono debe ser válido (9 dígitos)",
                required_sector: "Por favor, selecciona un sector",
                required_message: "El mensaje es obligatorio",
                recaptcha_missing: "Fallo en la validación del reCAPTCHA.",
                recaptcha_failed: "La validación de seguridad falló.",
                unknown: "Ha ocurrido un error. Inténtalo de nuevo."
            }
        },

        en: {
            meta: {
                title: "Industrial Laundry for Restaurants | Vega Baja (Alicante)",
                description: "Industrial laundry service in Formentera del Segura and Vega Baja (Alicante). Linens for restaurants and hospitality textiles. +20 years, free pickup and delivery in 24/48h."
            },
            brand: {
                nameHeader: 'Maiti<span class="text-primary">2</span>Wash',
                nameFooter: 'Maiti<span class="text-secondary">2</span>Wash'
            },
            nav: {
                inicio: "Home",
                servicios: "Services",
                contacto: "Contact",
                cta: "Free Quote",
                ctaLong: "Request B2B Rate"
            },
            hero: {
                title: 'Professional Laundry Service <br class="hidden md:inline"> for Hotels and Restaurants',
                subtitle: "Over 20 years taking care of local businesses' textiles. Free pickup and delivery in 24/48 hours with maximum hygiene guarantee.",
                ctaServices: "Our Services"
            },
            banners: {
                experience: "Years of Experience",
                pickup: "Free Pickup & Delivery",
                specialists: "Business Specialists"
            },
            form1: {
                title: "Quick Quote in 24h",
                subtitle: "Fill out this form and our team will get in touch with you.",
                submit: "Request Quote"
            },
            form: {
                namePlaceholder: "Full name *",
                phonePlaceholder: "Phone *",
                emailPlaceholder: "Business email *",
                sectorPlaceholder: "What type of business do you have? *",
                sector1: "Hospitality & Restaurants",
                sector2: "Hotels & Accommodation",
                sector3: "Tourist Apartments / Airbnb",
                sector4: "Gyms, Spas & Beauty Centers",
                sector5: "Other type of business",
                privacyPrefix: "I have read and accept the",
                privacyLink: "Privacy Policy"
            },
            services: {
                title: "Textile Solutions for Your Business",
                subtitle: "We offer a comprehensive service adapted to the needs and current health regulations of each industrial sector.",
                card1: {
                    title: "Hospitality & Restaurants",
                    desc: "Specialized treatment to remove tough grease and wine stains from tablecloths and napkins.",
                    item1: "Tablecloths and table runners",
                    item2: "Cloth napkins",
                    item3: "Kitchen and dining room uniforms"
                },
                card2: {
                    title: "Hotels & Guesthouses",
                    desc: "We guarantee perfect ironing and impeccable whiteness that will improve your guests' experience.",
                    item1: "Sheets and pillowcases",
                    item2: "Heavyweight towels",
                    item3: "Duvets and protectors"
                },
                card3: {
                    title: "Tourist Apartments",
                    desc: "Agile and flexible service adapted to guest check-in and check-out days (Airbnb, Booking).",
                    item1: "Express quick wash",
                    item2: "Per-guest linen kits",
                    item3: "Strict shortage control"
                }
            },
            about: {
                title: "Over Two Decades of Trust",
                subtitle: "A family business serving the local community",
                p1: "Founded more than 20 years ago, our industrial laundry combines traditional experience with the most advanced technology in the sector to deliver impeccable finishes and hygiene.",
                p2: "We understand that textile presentation is the calling card of your restaurant or hotel. We offer direct service, with no middlemen, guaranteeing maximum punctuality on every delivery.",
                feature1: "Personalized Service",
                feature2: "Quality Control",
                badgeTitle: "Hygiene Guarantee",
                badgeDesc: "Certified processes for hospitality"
            },
            reviews: {
                title: "Our customers recommend us on Google",
                basedOn: "Based on 30 reviews",
                roleB2B: "B2B Client",
                roleApts: "Tourist Apartments",
                roleGuide: "Local Guide",
                placeholderQuote: "\u201cReview text.\u201d",
                seeAll: "See all reviews on Google"
            },
            contact: {
                title: "Request a Detailed Consultation",
                subtitle: "Leave us your details and we'll get in touch to offer you a rate tailored to your business volume.",
                form: {
                    nameLabel: "Full Name *",
                    namePlaceholder: "e.g. John Smith",
                    companyLabel: "Company Name",
                    companyPlaceholder: "e.g. Blue Sea Restaurant",
                    phoneLabel: "Contact Phone *",
                    phonePlaceholder: "e.g. 600 000 000",
                    emailLabel: "Email Address *",
                    emailPlaceholder: "example@company.com",
                    messageLabel: "Message / Specific Needs",
                    messagePlaceholder: "Tell us how many kilos or items you estimate per week...",
                    submit: "Send Request"
                },
                info: {
                    locationTitle: "Location",
                    phoneTitle: "Business Phone",
                    hoursTitle: "Business Hours",
                    hoursValue: "Monday to Friday: 9:00 AM - 2:00 PM"
                }
            },
            footer: {
                tagline: "We optimize textile management for your business with high-efficiency industrial laundry solutions.",
                highlights: "Highlights",
                sendRequest: "Send Request",
                legal: "Legal",
                legalNotice: "Legal Notice",
                cookiePolicy: "Cookie Policy",
                contactTitle: "Contact",
                copyright: "\u00A9 2026 Industrial Laundry. All rights reserved."
            },
            messages: {
                sending: "Sending...",
                successTitle: "Sent successfully!",
                sendAnother: "Send another message",
                connectionError: "Connection error with the server.",
                send_success: "Your message was sent successfully!",
                send_error: "There was an error sending the message."
            },
            errors: {
                required_privacy: "Please accept the Privacy Policy",
                required_name: "Name is required",
                invalid_email: "Please enter a valid email",
                required_phone: "Phone number is required",
                invalid_phone: "Please enter a valid phone number (9 digits)",
                required_sector: "Please select a sector",
                required_message: "Message is required",
                recaptcha_missing: "reCAPTCHA validation failed.",
                recaptcha_failed: "Security validation failed.",
                unknown: "Something went wrong. Please try again."
            }
        }
    };

    function getNested(obj, path) {
        return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
    }

    function t(key, lang) {
        const useLang = lang || currentLang();
        const value = getNested(dict[useLang], key);
        if (value !== null) return value;
        // fallback al español si falta la clave en el otro idioma
        const fallback = getNested(dict[DEFAULT_LANG], key);
        return fallback !== null ? fallback : key;
    }

    function currentLang() {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    }

    function applyTranslations(lang) {
        document.documentElement.setAttribute("lang", lang);

        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            const value = t(key, lang);
            if (value !== null) el.textContent = value;
        });

        document.querySelectorAll("[data-i18n-html]").forEach((el) => {
            const key = el.getAttribute("data-i18n-html");
            const value = t(key, lang);
            if (value !== null) el.innerHTML = value;
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            const value = t(key, lang);
            if (value !== null) el.setAttribute("placeholder", value);
        });

        document.querySelectorAll("[data-i18n-content]").forEach((el) => {
            const key = el.getAttribute("data-i18n-content");
            const value = t(key, lang);
            if (value !== null) el.setAttribute("content", value);
        });

        // Botones de cambio de idioma (desktop + mobile)
        const nextLabel = lang === "es" ? "EN" : "ES";
        const labelEl = document.getElementById("lang-switch-label");
        const labelElMobile = document.getElementById("lang-switch-label-mobile");
        if (labelEl) labelEl.textContent = nextLabel;
        if (labelElMobile) labelElMobile.textContent = nextLabel;
    }

    function setLanguage(lang) {
        if (!dict[lang]) return;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations(lang);
    }

    function toggleLanguage() {
        const next = currentLang() === "es" ? "en" : "es";
        setLanguage(next);
    }

    // Exponemos una API mínima para usar desde script.js (mensajes dinámicos)
    window.i18n = {
        t,
        currentLang,
        setLanguage,
        toggleLanguage
    };

    document.addEventListener("DOMContentLoaded", function () {
        applyTranslations(currentLang());

        const btn = document.getElementById("lang-switch");
        const btnMobile = document.getElementById("lang-switch-mobile");
        if (btn) btn.addEventListener("click", toggleLanguage);
        if (btnMobile) btnMobile.addEventListener("click", toggleLanguage);
    });
})();
