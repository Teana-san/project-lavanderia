
CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom left",
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: "box"
      }
    },


    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {
        enabled: false
      }
    },


    language: {
      default: "es",
      translations: {
        es: {
          consentModal: {
            title: "En esta página web utilizamos Cookies.",
            description: 'Puedes obtener más información sobre nuestra política de Cookies <a href="./politica-de-cookies" rel="noopener" target="_blank" class="cc__link">aquí</a>',
            acceptAllBtn: "Aceptar todo",
            acceptNecessaryBtn: "Rechazar todo",
            showPreferencesBtn: "Gestionar preferencias",
            footer: `
                        <a href="./politica-de-privacidad/" target="_blank" rel="noopener">Política de Privacidad</a>
                        <a href="./condiciones-de-contratacion/" target="_blank" rel="noopener">Condiciones de contratación</a>
                    `
          },


          preferencesModal: {
            title: "Preferencias de cookies",
            acceptAllBtn: "Aceptar todo",
            acceptNecessaryBtn: "Solo necesarias",
            savePreferencesBtn: "Guardar preferencias",
            closeIconLabel: "Cerrar",
            sections: [
              {
                title: "Uso de cookies",
                description: "Usamos cookies para mejorar la experiencia del usuario."
              },
              {
                title: "Cookies necesarias",
                linkedCategory: "necessary"
              },
              {
                title: "Cookies analíticas",
                linkedCategory: "analytics"
              }
            ]
          }


        } // fin de es
      } // fin de translations
    } // fin de language
  });
