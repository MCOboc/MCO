document.addEventListener('DOMContentLoaded', function () {
    // Récupérer les paramètres de l'URL
    const params = getUrlParams();
  
    // Récupérer les valeurs des paramètres
    const WGTID = params.WGTID;
    const CodeRF = params.CodeRF;
    const Date = params.Date;
    const Nom = params.Nom;
  
    // Afficher les valeurs dans le conteneur
    displayValues(WGTID, CodeRF, Date, Nom);
  });
  
  // Fonction pour récupérer les paramètres de l'URL
  function getUrlParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlSearchParams) {
      params[key] = value;
    }
    return params;
  }
  
  function displayValues(WGTID, CodeRF, Date, Nom) {
    // Récupérer le conteneur
    const container = document.getElementById('pdf-container');
  
    // Vérifier si le conteneur existe
    if (container) {
      // Afficher les valeurs dans le conteneur
      container.innerHTML = `
        <p>WGTID: ${WGTID}</p>
        <p>Code RF: ${CodeRF}</p>
        <p>Date: ${Date}</p>
        <p>Nom: ${Nom}</p>
        <!-- Ajoutez d'autres éléments selon vos besoins -->
      `;
    } else {
      console.error("Le conteneur PDF n'a pas été trouvé dans la page.");
    }
  }
  