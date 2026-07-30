/* Google tag (gtag.js) - Google Ads AW-965371752 */
window.dataLayer = window.dataLayer || [];
function gtag() {
    dataLayer.push(arguments);
}
window.gtag = gtag;

(function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-965371752';
    document.head.appendChild(s);
})();

gtag('js', new Date());
gtag('config', 'AW-965371752');

/* Conversión: formulario superior horizontal, página inicio */
function gtag_report_conversion(url) {
    var callback = function () {
        if (typeof url !== 'undefined') {
            window.location = url;
        }
    };
    gtag('event', 'conversion', {
        send_to: 'AW-965371752/neiXCPeL_LAcEOjOqcwD',
        event_callback: callback
    });
    return false;
}
window.gtag_report_conversion = gtag_report_conversion;

/* Conversión: formulario inferior vertical, página inicio */
function gtag_report_conversion_bottom() {
    gtag('event', 'conversion', {
        send_to: 'AW-965371752/_EQgCPCqvrEcEOjOqcwD'
    });
    return false;
}
window.gtag_report_conversion_bottom = gtag_report_conversion_bottom;

/* Conversión: formulario superior horizontal, página desarrollo-a-medida */
function gtag_report_conversion_medida() {
    gtag('event', 'conversion', {
        send_to: 'AW-965371752/xudZCK6xwLEcEOjOqcwD'
    });
    return false;
}
window.gtag_report_conversion_medida = gtag_report_conversion_medida;

/* Conversión: formulario inferior vertical, página desarrollo-a-medida */
function gtag_report_conversion_medida_bottom() {
    gtag('event', 'conversion', {
        send_to: 'AW-965371752/jIddCMiVqbEcEOjOqcwD'
    });
    return false;
}
window.gtag_report_conversion_medida_bottom = gtag_report_conversion_medida_bottom;

/* Conversión: botón flotante WhatsApp */
function gtag_report_conversion_whatsapp() {
    gtag('event', 'conversion', {
        send_to: 'AW-965371752/wsrmCKW4p7EcEOjOqcwD',
        value: 1.0,
        currency: 'EUR'
    });
    return false;
}
window.gtag_report_conversion_whatsapp = gtag_report_conversion_whatsapp;

/* Clic en #whatsApp (todas las páginas donde exista el botón) */
document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('#whatsApp') : null;
    if (!link) return;
    if (typeof window.gtag_report_conversion_whatsapp === 'function') {
        window.gtag_report_conversion_whatsapp();
    }
});
