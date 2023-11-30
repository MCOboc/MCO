let data; // Déclarer la variable data dans la portée globale
window.jsPDF = window.jspdf.jsPDF;
var imageCache = null;
function loadWgtidDropdown(data) {
  // Récupère les éléments DOM
  const selectWgtid = document.getElementById('selectWgtid');
  const selectCodeRF = document.getElementById('selectCodeRF');
  const autreWgtidInput = document.getElementById('autreWgtidInput');
  const valeurWGTID = autreWgtidInput.value;
  const autreCodeRFInput = document.getElementById('autreCodeRFInput');
  const valeurCodeRF = autreCodeRFInput.value;
  // Récupérez l'élément DOM pour le dropdown "Bâtiment"
const selectBatiment = document.getElementById('selectBatiment');

// Vérifiez si l'élément DOM est présent
if (!selectBatiment) {
  console.error('L\'élément DOM pour le dropdown "Bâtiment" n\'est pas présent.');
} else {
  // Supprimez les options existantes
  selectBatiment.innerHTML = '';

  // Récupérez toutes les valeurs uniques de "Bâtiment"
  const batimentValues = [...new Set(data.map(entry => entry.Bâtiment))];

  // Triez les valeurs par ordre croissant
  batimentValues.sort();

  // Ajoutez une option par défaut pour le dropdown "Bâtiment"
  const defaultBatimentOption = document.createElement('option');
  defaultBatimentOption.value = ''; // Valeur vide pour une sélection par défaut
  defaultBatimentOption.text = 'Bâtiments...';
  selectBatiment.appendChild(defaultBatimentOption);

  // Ajoutez chaque valeur triée au dropdown "Bâtiment"
  batimentValues.forEach(value => {
    const optionElement = document.createElement('option');
    optionElement.value = value;
    optionElement.text = value;
    selectBatiment.appendChild(optionElement);
  });

  // Ajoutez un gestionnaire d'événements pour détecter les changements dans le dropdown "Bâtiment"
  selectBatiment.addEventListener('change', function () {
    const selectedBatiment = this.value;
    const selectedWgtid = selectWgtid.value;
    const selectedCodeRF = selectCodeRF.value;
  
    updateInfoFromCodeRF(selectedCodeRF);
    updateAutreInputs(selectedWgtid, selectedCodeRF);

    // Filtrer les données en fonction du "Bâtiment" sélectionné
    const filteredData = data.filter(entry => entry.Bâtiment === selectedBatiment);

    // Mettez à jour les dropdowns "WTID" et "CodeRF" avec les données filtrées
    updateDropdownOptions(selectWgtid, filteredData, 'WGTID', autreWgtidInput);
    updateDropdownOptions(selectCodeRF, filteredData, 'Code RF', autreCodeRFInput);
    
  });
}


  // Vérifie si les éléments DOM sont présents
  if (!selectWgtid || !selectCodeRF || !autreWgtidInput || !autreCodeRFInput) {
    console.error('Les éléments DOM ne sont pas présents.');
    return;
  }

  // Supprime les options existantes
  selectWgtid.innerHTML = '';
  selectCodeRF.innerHTML = '';

  const defaultWgtidOption = document.createElement('option');
  defaultWgtidOption.value = ''; // Valeur vide pour une sélection par défaut
  defaultWgtidOption.text = 'WGTID...';
  selectWgtid.appendChild(defaultWgtidOption);

  const defaultCodeRFOption = document.createElement('option');
  defaultCodeRFOption.value = ''; // Valeur vide pour une sélection par défaut
  defaultCodeRFOption.text = 'Code RF...';
  selectCodeRF.appendChild(defaultCodeRFOption);

  // Récupère toutes les valeurs uniques de "WGTID" et "Code RF"
  const wgtidValues = [...new Set(data.map(entry => entry.WGTID))];
  const codeRFValues = [...new Set(data.map(entry => entry['Code RF']))];

  // Triez les valeurs par ordre croissant
wgtidValues.sort();
codeRFValues.sort();
  
  // Ajoute chaque valeur au dropdown "WGTID"
  wgtidValues.forEach(value => {
    const optionElement = document.createElement('option');
    optionElement.value = value;
    optionElement.text = value;
    selectWgtid.appendChild(optionElement);
  });

  // Ajoute chaque valeur au dropdown "Code RF"
  codeRFValues.forEach(value => {
    const optionElement = document.createElement('option');
    optionElement.value = value;
    optionElement.text = value;
    selectCodeRF.appendChild(optionElement);
  });

  // Ajoute des écouteurs d'événements pour détecter le choix dans les dropdowns
  selectWgtid.addEventListener('change', function () {
    const selectedWgtid = this.value;
  const selectedCodeRF = selectCodeRF.value;

  updateInfoFromCodeRF(selectedCodeRF);
  updateAutreInputs(selectedWgtid, selectedCodeRF);
    handleWgtidChange(data, selectCodeRF, this.value, autreWgtidInput, autreCodeRFInput);
  });

  selectCodeRF.addEventListener('change', function () {
    const selectedCodeRF = this.value;
  const selectedWgtid = selectWgtid.value;

  updateInfoFromCodeRF(selectedCodeRF);
  updateAutreInputs(selectedWgtid, selectedCodeRF);
    handleCodeRFChange(data, selectWgtid, this.value, autreCodeRFInput, autreWgtidInput);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Remplacez 'donnees.json' par le chemin approprié vers votre fichier JSON
  fetch('donnees.json')
    .then(response => response.json())
    .then(jsonData => {
      // Appel de loadWgtidDropdown avec les données
      loadWgtidDropdown(jsonData);
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
});

function updateDropdownOptions(dropdown, options, property) {
  // Supprime les options existantes
  dropdown.innerHTML = '';

  // Récupère toutes les valeurs uniques de la propriété spécifiée
  const propertyValues = [...new Set(options.map(entry => entry[property]))];
  propertyValues.sort();
  // Ajoute chaque valeur au dropdown
  propertyValues.forEach(value => {
    const optionElement = document.createElement('option');
    optionElement.value = value;
    optionElement.text = value;
    dropdown.appendChild(optionElement);
  });
}

function resetDropdowns() {
  window.location.href = "pdf.html";
}

function handleWgtidChange(data, selectCodeRF, selectedWgtid, autreWgtidInput, autreCodeRFInput) {
  // Met à jour l'autre input avec la valeur sélectionnée
  autreWgtidInput.value = selectedWgtid;

  // Appel de la fonction pour mettre à jour les informations
  updateInfoFromWgtid(selectedWgtid);

  // Filtrer les options du deuxième dropdown en fonction de la sélection dans le premier dropdown
  const filteredOptions = data.filter(entry => entry.WGTID === selectedWgtid);
  updateDropdownOptions(selectCodeRF, filteredOptions, 'Code RF');

  // Met à jour l'autre input Code RF
  if (filteredOptions.length > 0) {
    autreCodeRFInput.value = filteredOptions[0]['Code RF'];
  } else {
    autreCodeRFInput.value = '';
  }
}
document.addEventListener('DOMContentLoaded', function () {
  // Remplacez 'donnees.json' par le chemin approprié vers votre fichier JSON
  fetch('donnees.json')
     .then(response => response.json())
     .then(data => {
        console.log('Data loaded:', data);
        loadWgtidDropdown(data);
        displayResults();  // Ajoutez cet appel ici
     })
     .catch(error => console.error('Erreur lors du chargement des données :', error));
});


function handleCodeRFChange(data, selectWgtid, selectedCodeRF, autreCodeRFInput, autreWgtidInput) {
  // Met à jour l'autre input avec la valeur sélectionnée
  autreCodeRFInput.value = selectedCodeRF;

  updateInfoFromCodeRF(selectedCodeRF);

  // Filtrer les options du premier dropdown en fonction de la sélection dans le deuxième dropdown
  const filteredOptions = data.filter(entry => entry['Code RF'] === selectedCodeRF);
  updateDropdownOptions(selectWgtid, filteredOptions, 'WGTID');

  // Met à jour l'autre input WGTID
  if (filteredOptions.length > 0) {
    autreWgtidInput.value = filteredOptions[0].WGTID;
  } else {
    autreWgtidInput.value = '';
  }
}
document.addEventListener('DOMContentLoaded', function () {
  flatpickr("#date", {
      enableTime: false, // Vous pouvez activer ou désactiver l'heure selon vos besoins
      dateFormat: "d.m.Y", // Format de la date
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Récupère la case à cocher et les éléments à afficher/masquer
  const checkbox = document.getElementById('checkbox0');
  const valider2Button = document.getElementById('valider2Button');
  const textWgtid = document.getElementById('textwgtid');
  const textcoderf = document.getElementById('textcoderf');
  const autreWgtidInput = document.getElementById('autreWgtidInput');
  const autreCodeRFInput = document.getElementById('autreCodeRFInput');
  const selectWgtid = document.getElementById('selectWgtid');
  const selectCodeRF = document.getElementById('selectCodeRF');
  const validerButton = document.getElementById('validerButton');
  
  // Ajoute un gestionnaire d'événements à la case à cocher
  checkbox.addEventListener('change', function() {

    console.log('Checkbox checked:', this.checked);

    // Si la case à cocher est cochée, affiche les éléments, sinon les masque
    if (this.checked) {
      addInfoInputs();
      textWgtid.style.display = 'block';
      textcoderf.style.display = 'block';
      validerButton.style.display = 'block';
      selectWgtid.style.display = 'none';
      selectCodeRF.style.display = 'none';
      valider2Button.style.display = 'none';

      // AutreWgtidInput prend la valeur de TextWgtid
      autreWgtidInput.value = textWgtid.innerText || textWgtid.textContent;
      autreCodeRFInput.value = textcoderf.innerText || textcoderf.textContent;

    } else {
      document.getElementById('fournisseur').classList.remove('classtestred');
      document.getElementById('batimentinfo').classList.remove('classtestred');
      document.getElementById('salle').classList.remove('classtestred');
      document.getElementById('datemco').classList.remove('classtestred');
      document.getElementById('batimentinfo').setAttribute('readonly', true);
      document.getElementById('fournisseur').setAttribute('readonly', true);
      document.getElementById('salle').setAttribute('readonly', true);
      document.getElementById('datemco').setAttribute('readonly', true);
      textWgtid.style.display = 'none';
      textcoderf.style.display = 'none';
      validerButton.style.display = 'none';
      selectWgtid.style.display = 'block';
      selectCodeRF.style.display = 'block';
      valider2Button.style.display = 'block';

      // AutreWgtidInput prend la valeur sélectionnée dans le dropdown
      autreWgtidInput.value = selectWgtid.value;
      autreCodeRFInput.value = selectCodeRF.value;
    }

    // Forcer la saisie en chiffre uniquement dans "textwgtid" et uniquement 6 chiffres
    const textWgtidInput = document.getElementById('textwgtid');
    textWgtidInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 6); // Ne garde que les chiffres et limite à 6 caractères
    });

    // Forcer la saisie en majuscules dans "textcoderf"
    const textCodeRFInput = document.getElementById('textcoderf');
    textCodeRFInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase().slice(0, 9);
    });
    console.log('AutreWgtidInput value:', autreWgtidInput.value);
  });
});


function handleValiderButtonClick() {
  console.log('Valider button clicked');

  // Récupérer les éléments DOM
  const autreWgtidInput = document.getElementById('autreWgtidInput');
  const autreCodeRFInput = document.getElementById('autreCodeRFInput');
  const textWgtid = document.getElementById('textwgtid');
  const textcoderf = document.getElementById('textcoderf');

  // Afficher les valeurs dans la console pour le débogage
  console.log('textWgtid value:', textWgtid.value);
  console.log('textcoderf value:', textcoderf.value);

  // Copier les valeurs de textWgtid et textcoderf dans autreWgtidInput et autreCodeRFInput
  autreWgtidInput.value = textWgtid.value;
  autreCodeRFInput.value = textcoderf.value;

  // Vérifier si une valeur pour la clé "Code RF" correspondante existe dans donnees.json
  const selectedWgtid = autreWgtidInput.value;

  fetch('donnees.json')
    .then(response => response.json())
    .then(data => {
      const matchingEntry = data.find(entry => entry.WGTID === selectedWgtid);
      const checkbox0 = document.getElementById('checkbox0');

      if (matchingEntry && 'Code RF' in matchingEntry) {
        const matchingCodeRF = matchingEntry['Code RF'];
        const selectedCodeRF = matchingCodeRF;
        console.log(`Code RF correspondant trouvé : ${matchingCodeRF}`);
        textcoderf.value = matchingCodeRF;
        autreCodeRFInput.value = matchingCodeRF;
        updateInfoFromCodeRF(selectedCodeRF);
        checkbox0.checked = false;
        document.getElementById('fournisseur').classList.remove('classtestred');
        document.getElementById('batimentinfo').classList.remove('classtestred');
        document.getElementById('salle').classList.remove('classtestred');
        document.getElementById('datemco').classList.remove('classtestred');
        // Vous pouvez ajouter ici le code pour traiter le cas où le Code RF correspondant est trouvé.
      } else {
        console.log('Aucun Code RF correspondant trouvé.');
        document.getElementById('batimentinfo').removeAttribute('readonly');
        document.getElementById('fournisseur').removeAttribute('readonly');
        document.getElementById('salle').removeAttribute('readonly');
        document.getElementById('datemco').removeAttribute('readonly');
        showTooltip();
        // Vous pouvez ajouter ici le code pour traiter le cas où aucun Code RF correspondant n'est trouvé.
      }
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
}

function handleValider2ButtonClick() {
  console.log('Valider2 button clicked');

  // Récupérer les éléments DOM
  const autreWgtidInput = document.getElementById('autreWgtidInput');
  const autreCodeRFInput = document.getElementById('autreCodeRFInput');
  const textWgtid = document.getElementById('selectWgtid');
  const textcoderf = document.getElementById('selectCodeRF');

  // Afficher les valeurs dans la console pour le débogage
  console.log('selectWgtid value:', textWgtid.value);
  console.log('selectCodeRF value:', textcoderf.value);

  // Copier les valeurs de textWgtid et textcoderf dans autreWgtidInput et autreCodeRFInput
  autreWgtidInput.value = textWgtid.value;
  autreCodeRFInput.value = textcoderf.value;
}

function displayResults() {
  const resultText = document.getElementById('visueltext');
  const resultText2 = document.getElementById('manueltext');
  const autreWgtidInput = document.getElementById('autreWgtidInput');

  // Charger le fichier JSON directement ici
  fetch('donnees.json')
    .then(response => response.json())
    .then(results => {
      if (results && results.length > 0) {
        let resultString = '';

        // Afficher la valeur de "Contrôle visuel" pour la clé "WGTID" sélectionnée
        const selectedWgtid = autreWgtidInput.value;

        const selectedEntry = results.find(entry => entry.WGTID === selectedWgtid);

        if (selectedEntry && 'Contrôle Visuel' in selectedEntry) {
          resultString += selectedEntry['Contrôle Visuel'];
        }

        resultText.innerHTML = resultString;
      } else {
        resultText.innerHTML = 'Aucune correspondance trouvée.';
      }

    fetch('donnees.json')
    .then(response => response.json())
    .then(results => {
      if (results && results.length > 0) {
        let resultString = '';
        const selectedWgtid = autreWgtidInput.value;

        const selectedEntry = results.find(entry => entry.WGTID === selectedWgtid);

       if (selectedEntry && 'Action mécanique' in selectedEntry) {
        resultString += selectedEntry['Action mécanique'];
       }
       resultText2.innerHTML = resultString;
      } else {
        resultText2.innerHTML = 'Aucune correspondance trouvée.';
       }
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
})
}

// Code à exécuter lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function () {
  // Remplacez 'donnees.json' par le chemin approprié vers votre fichier JSON
  fetch('donnees.json')
     .then(response => response.json())
     .then(data => {
        console.log('Data loaded:', data);
        loadWgtidDropdown(data);
        displayResults();  // Ajoutez cet appel ici
     })
     .catch(error => console.error('Erreur lors du chargement des données :', error));
});


function updateAutreInputs(selectedWgtid, selectedCodeRF) {
  const autreWgtidInput = document.getElementById('autreWgtidInput');
  const autreCodeRFInput = document.getElementById('autreCodeRFInput');

  autreWgtidInput.value = selectedWgtid;
  autreCodeRFInput.value = selectedCodeRF;
}

function updateInfoFromWgtid(selectedWgtid) {
  fetch('donnees.json')
    .then(response => response.json())
    .then(data => {
      console.log('Data loaded:', data);
      const matchingEntry = data.find(entry => entry.WGTID === selectedWgtid);
      console.log('Correspondance WGTID :', matchingEntry);

      // Vérifiez si une correspondance a été trouvée
      if (matchingEntry) {
        // Mettez à jour les éléments avec les valeurs correspondantes
        updateAutreInputs(matchingEntry.WGTID, matchingEntry['Code RF']);

        document.getElementById('fournisseur').value = matchingEntry.Fournisseur || '';
        console.log('Fournisseur :', matchingEntry.Fournisseur);
        document.getElementById('batimentinfo').value = matchingEntry.Bâtiment || '';
        document.getElementById('salle').value = matchingEntry['Finale RJH complète'] || '';

        // Formate la date de "mm/dd/yyyy" à "dd/mm/yyyy"
        const rawDate = matchingEntry['Date dernière MCO'];
        const formattedDate = formatDateString(rawDate);
        document.getElementById('datemco').value = formattedDate || '';
      } else {
        // Si aucune correspondance n'est trouvée, réinitialisez les éléments à une valeur par défaut ou vide
        resetInfoInputs();
      }
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
}

function updateInfoFromCodeRF(selectedCodeRF) {
  fetch('donnees.json')
    .then(response => response.json())
    .then(data => {
      console.log('Data loaded:', data);
      const matchingEntry = data.find(entry => entry['Code RF'] === selectedCodeRF);
      console.log('Correspondance Code RF:', matchingEntry);

      // Vérifiez si une correspondance a été trouvée
      if (matchingEntry) {
        // Mettez à jour les éléments avec les valeurs correspondantes
        updateAutreInputs(matchingEntry.WGTID, matchingEntry['Code RF']);

        document.getElementById('fournisseur').value = matchingEntry.Fournisseur || '';
        console.log('Fournisseur :', matchingEntry.Fournisseur);
        document.getElementById('batimentinfo').value = matchingEntry.Bâtiment || '';
        document.getElementById('salle').value = matchingEntry['Finale RJH complète'] || '';

        // Formate la date de "mm/dd/yyyy" à "dd/mm/yyyy"
        const rawDate = matchingEntry['Date dernière MCO'];
        const formattedDate = rawDate ? formatDateString(rawDate) : '';
        document.getElementById('datemco').value = formattedDate || '';
      } else {
        // Si aucune correspondance n'est trouvée, réinitialisez les éléments à une valeur par défaut ou vide
        resetInfoInputs();
      }
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));
}

function addInfoInputs() {
  document.getElementById('fournisseur').classList.add('classtestred');
  document.getElementById('batimentinfo').classList.add('classtestred');
  document.getElementById('salle').classList.add('classtestred');
  document.getElementById('datemco').classList.add('classtestred');
  document.getElementById('fournisseur').value = 'A compléter';
  document.getElementById('batimentinfo').value = 'A compléter';
  document.getElementById('salle').value = 'A compléter';
  document.getElementById('datemco').value = 'A compléter';
}

function resetInfoInputs() {
  // Réinitialisez les éléments à une valeur par défaut ou vide
  document.getElementById('fournisseur').value = 'N/A';
  document.getElementById('batimentinfo').value = 'N/A';
  document.getElementById('salle').value = 'N/A';
  document.getElementById('datemco').value = 'N/A';
}

function formatDateString(rawDate) {
  // Analyse la date au format "mm/dd/yyyy"
  const parts = rawDate.split('/');
  const month = parts[0];
  const day = parts[1];
  const year = parts[2];

  // Construit la nouvelle chaîne de date au format "dd/mm/yyyy"
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
function copyText() {
  // Récupérer les éléments textarea
  const visueltext = document.getElementById('visueltext');
  const visueltextfull = document.getElementById('visueltextfull');
  const manueltext = document.getElementById('manueltext');
  const manueltextfull = document.getElementById('manueltextfull');
  const checkbox1 = document.getElementById('checkbox1');
  const conformView = document.getElementById('confresult1')
  const checkbox3 = document.getElementById('checkbox3');
  const checkbox2 = document.getElementById('checkbox2');
  const conformView2 = document.getElementById('confresult2');
  const checkbox4 = document.getElementById('checkbox4');

  // Copier la valeur du premier textarea vers le second
  visueltextfull.value = visueltext.value;
  manueltextfull.value = manueltext.value;
  // Vérifier si checkbox1 est cochée
  conformView.value = checkbox1.checked ? 'OUI' : 'NON';
  conformView2.value = checkbox2.checked ? 'OUI' : 'NON';
  document.getElementById('confresult1').classList.add('classtestgreen');
  document.getElementById('confresult2').classList.add('classtestgreen');

  // Si checkbox3 est cochée, modifier la valeur
  if (checkbox3.checked) {
    conformView.value = 'NON';
    document.getElementById('confresult1').classList.add('classtestred');
  }
  if (checkbox4.checked) {
    conformView2.value = 'NON';
    document.getElementById('confresult2').classList.add('classtestred');
  }
}

function doubleFonction() {
  handleValiderButtonClick();
  displayResults();
}

document.addEventListener('DOMContentLoaded', function () {
  const checkbox1 = document.getElementById('checkbox1');
  const checkbox2 = document.getElementById ('checkbox2');
  const checkbox3 = document.getElementById('checkbox3');
  const checkbox4 = document.getElementById('checkbox4');
  const maintButton = document.getElementById('maint-button');

  // Ajoute des écouteurs d'événements pour détecter les changements dans les cases à cocher
  checkbox1.addEventListener('change', function () {
    // Vérifie si checkbox1 est cochée
    if (checkbox1.checked) {
      // Si checkbox1 est cochée, décoche checkbox3
      checkbox3.checked = false;
    }

    // Met à jour la visibilité du bouton
    updateMaintButtonVisibility();
  });
  // Ajoute des écouteurs d'événements pour détecter les changements dans les cases à cocher
  checkbox2.addEventListener('change', function () {
    // Vérifie si checkbox1 est cochée
    if (checkbox2.checked) {
      // Si checkbox1 est cochée, décoche checkbox3
      checkbox4.checked = false;
    }

    // Met à jour la visibilité du bouton
    updateMaintButtonVisibility();
  });

  checkbox3.addEventListener('change', function () {
    // Vérifie si checkbox3 est cochée
    if (checkbox3.checked) {
      // Si checkbox3 est cochée, décoche checkbox1
      checkbox1.checked = false;
    }

    // Met à jour la visibilité du bouton
    updateMaintButtonVisibility();
  });
  // Ajoute des écouteurs d'événements pour détecter les changements dans les cases à cocher
  checkbox4.addEventListener('change', function () {
    // Vérifie si checkbox1 est cochée
    if (checkbox4.checked) {
      // Si checkbox1 est cochée, décoche checkbox3
      checkbox2.checked = false;
    }

    // Met à jour la visibilité du bouton
    updateMaintButtonVisibility();
  });

  // Appelle la fonction initiale pour définir la visibilité initiale du bouton
  updateMaintButtonVisibility();
});
document.addEventListener('DOMContentLoaded', function () {
  // Ajouter un écouteur d'événements à la checkbox3 et 4
  var checkbox3 = document.getElementById('checkbox3');
  var checkbox4 = document.getElementById('checkbox4');

  if (checkbox3) {  // Vérifiez si l'élément existe avant d'ajouter l'écouteur
    checkbox3.addEventListener('change', showPopup);
  } else {
    console.error('L\'élément avec l\'ID "checkbox3" n\'a pas été trouvé.');
  }
  if (checkbox4) {
    checkbox4.addEventListener('change', showPopup2);
  } else {
    console.error('L\'élément avec l\'ID "checkbox4" n\'a pas été trouvé.');
  }
});

// Fonction pour afficher une alerte si checkbox1 est cochée
function showPopup() {
  // Récupérer la checkbox1
  var checkbox3 = document.getElementById('checkbox3');

  // Vérifier si la checkbox1 est cochée
  if (checkbox3.checked) {
    // Afficher un message dans la console
    console.log('Checkbox3 est cochée !');
    // Afficher une alerte
    alert('Pensez à ajouter le commentaire de la non-conformité dans la case "Contrôle Visuel" !');
  } else {
    // Afficher un message dans la console
    console.log('Checkbox3 n\'est pas cochée.');
  }
}
function showPopup2() {
  var checkbox4 = document.getElementById('checkbox4');
  if (checkbox4.checked) {
    // Afficher un message dans la console
    console.log('Checkbox4 est cochée !');
    // Afficher une alerte
    alert('Pensez à ajouter le commentaire de la non-conformité dans la case "Action mécanique" !');
  } else {
    // Afficher un message dans la console
    console.log('Checkbox4 n\'est pas cochée.');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const checkbox1 = document.getElementById('checkbox1');
  const checkbox2 = document.getElementById('checkbox2');
  const checkbox3 = document.getElementById('checkbox3');
  const checkbox4 = document.getElementById('checkbox4');
  const maintButton = document.getElementById('maint-button');

  function updateMaintButtonVisibility() {
    const condition1 = checkbox1.checked && checkbox2.checked;
    const condition2 = checkbox1.checked && checkbox4.checked;
    const condition3 = checkbox3.checked && checkbox2.checked;
    const condition4 = checkbox3.checked && checkbox4.checked;

    const shouldEnableButton = condition1 || condition2 || condition3 || condition4;

    maintButton.disabled = !shouldEnableButton;

   }
  // Ajoute des écouteurs d'événements pour détecter les changements dans les cases à cocher
  checkbox1.addEventListener('change', updateMaintButtonVisibility);
  checkbox2.addEventListener('change', updateMaintButtonVisibility);
  checkbox3.addEventListener('change', updateMaintButtonVisibility);
  checkbox4.addEventListener('change', updateMaintButtonVisibility);

  // Appelle la fonction initiale pour définir la visibilité initiale du bouton
  updateMaintButtonVisibility();
});

document.addEventListener('DOMContentLoaded', function () {
  // ... (votre code existant)

  // Sélectionnez les champs pertinents
  const dateInput = document.getElementById('date');
  const emailInput = document.getElementById('textemail');
  const nomInput = document.getElementById('nom');
  const prenomInput = document.getElementById('prenom');
  const pdfButton = document.getElementById('pdf-button');

  // Ajoutez des écouteurs d'événements pour détecter les changements dans les champs
  dateInput.addEventListener('input', updatePdfButtonVisibility);
  emailInput.addEventListener('input', updatePdfButtonVisibility);
  nomInput.addEventListener('input', updatePdfButtonVisibility);
  prenomInput.addEventListener('input', updatePdfButtonVisibility);

  // ...

  // Définissez la visibilité initiale du bouton
  updatePdfButtonVisibility();
});

// Ajoutez une fonction pour mettre à jour la visibilité du bouton
function updatePdfButtonVisibility() {
  const dateInput = document.getElementById('date');
  const emailInput = document.getElementById('textemail');
  const nomInput = document.getElementById('nom');
  const prenomInput = document.getElementById('prenom');
  const pdfButton = document.getElementById('pdf-button');

  // Vérifiez si tous les champs ont du contenu
  const allFieldsFilled = dateInput.value.trim() !== '' &&
                        emailInput.value.trim() !== '' &&
                        nomInput.value.trim() !== '' &&
                        prenomInput.value.trim() !== '';

// Vérifiez si l'email est au format valide
const isValidEmail = validateEmail(emailInput.value.trim());

// Mettez à jour la visibilité du bouton en fonction des conditions
const shouldEnableButton2 = allFieldsFilled && isValidEmail;

pdfButton.disabled = !shouldEnableButton2;

}

// Ajoutez une fonction pour valider le format de l'email
 function validateEmail(email) {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}  

FilePond.registerPlugin(FilePondPluginFileEncode);
FilePond.create(document.getElementById('fileInput'));

function ajouterPhoto() {
  // Déclencher le clic sur l'élément d'entrée de fichier
  document.getElementById('fileInput').click();
}

function chargerImage(event) {
  // Récupérer le fichier à partir de l'événement
  var fichier = event.currentTarget.files[0];

  if (fichier) {
    // Vérifier si le fichier est au format JPEG
    if (fichier.type === 'image/jpeg') {
      var lecteur = new FileReader();

      lecteur.onload = function (e) {
        // Stocker l'image dans le cache
        imageCache = e.target.result;
        console.log("Image chargée avec succès et stockée dans le cache !");
        document.getElementById('nomFichier').innerText = fichier.name;
      };

      lecteur.onerror = function (e) {
        console.error("Erreur lors du chargement de l'image :", e.target.error);
      };

      lecteur.readAsDataURL(fichier);
    } else {
      console.error("Veuillez sélectionner un fichier au format JPEG.");
    }
  } else {
    console.error("Aucun fichier trouvé dans l'événement.");
  }
}

function generatePDF() {
  var doc = new jsPDF();
  var toemail = document.getElementById('textemail').value;
  var nomdestinataire = document.getElementById('prenom').value;

  const valeurCodeRF = autreCodeRFInput.value;
  const valeurWGTID = autreWgtidInput.value;
  const valeurFournisseur = fournisseur.value;
  const valeurBatiment = batimentinfo.value;
  const valeurSalle = salle.value;
  const valeurDate = datemco.value;
  const conformVisuO = confresult1.value === 'OUI' ? confresult1.value : '';
  const conformVisuN = confresult1.value === 'NON' ? confresult1.value : '';
  const conformMecaO = confresult2.value === 'OUI' ? confresult2.value : '';
  const conformMecaN = confresult2.value === 'NON' ? confresult2.value : '';
  const visutext = visueltextfull.value;
  const mecatext = manueltextfull.value;
  const valeurnomenmaj = nom.value;
  const valeurnom = valeurnomenmaj.toUpperCase();
  const valeurprenom = prenom.value;
  const valeurdate = date.value;
  const noticetext = "Les actions présentées ci-dessous sont extraites des notices fournies par les fabricants ou fournisseurs des équipements. Ces documents peuvent être consultés sur la page de recherche avancée du site, en renseignant le numéro WGTID ou Code RF.";
  const xPosition1 = 11; // Position horizontale
  const yPosition1 = 90; // Position verticale notice
  const yPosition2 = 115; // Position verticale contrôle visuel
  const yPosition3 = 186; // Position verticale action méca
  const maxWidth1 = 220; // Largeur maximale avant le saut de ligne
  const maxWidth2 = 150;
  const lineHeight1 = 5; // Hauteur de ligne (taille de police)
  const lineHeight2 = 5; // Hauteur de ligne contrôle visuel
  const textLines1 = doc.splitTextToSize(noticetext, maxWidth1);
  const textLines2 = doc.splitTextToSize(visutext, maxWidth2);
  const textLines3 = doc.splitTextToSize(mecatext, maxWidth2);
  
      // Ajoutez l'image au PDF
      doc.addImage("logo boccard.jpg", 'JPEG', 12, 12, 35, 10);
      doc.addImage("logo cea.jpg", 'JPEG', 170, 8, 20, 20);
      doc.setLineWidth(0.1); 
      doc.line(10, 5, 200, 5) // Ligne horizontale haute en-tête
      doc.setLineWidth(0.1); 
      doc.line(10, 30, 200, 30) // Ligne horizontale bas en-tête
      doc.setLineWidth(0.1);
      doc.line(10, 5, 10, 30) //Ligne verticale gauche-gauche en-tête
      doc.setLineWidth(0.1);
      doc.line(50, 5, 50, 30) //Ligne verticale gauche-droite en-tête
      doc.setLineWidth(0.1);
      doc.line(160, 5, 160, 30) // Ligne verticale droite-gauche en-tête
      doc.setLineWidth(0.1);
      doc.line(200, 5, 200, 30) // Ligne verticale droite-droite en-tête
      doc.setLineWidth(0.1);
      doc.line(10, 50, 200, 50) // Ligne supérieure cadre
      doc.setLineWidth(0.1);
      doc.line(10, 50, 10, 287) // Ligne gauche cadre
      doc.setLineWidth(0.1);
      doc.line(200, 50, 200, 287) // Ligne droite cadre
      doc.setLineWidth(0.1);
      doc.line(10, 287, 200, 287) // Ligne inférieure cadre
      doc.setLineWidth(0.1);
      doc.line(10, 257, 200, 257) // Ligne inférieure supp signature
      doc.setLineWidth(0.1);
      doc.line(70, 257, 70, 287) // Séparateur signature
      doc.setLineWidth(0.1);
      doc.line(140, 257, 140, 287) // Séparateur signature
      doc.setLineWidth(0.1);
      doc.line(10, 80, 200, 80) // Ligne horizontale inf refs 
      doc.setLineWidth(0.1);
      doc.line(10, 65, 200, 65) // Ligne horizontale sup refs 
      doc.setLineWidth(0.1);
      doc.line(70, 50, 70, 80) // Séparateur refs
      doc.setLineWidth(0.1);
      doc.line(140, 50, 140, 80) // Séparateur refs
      doc.line(10, 85, 200, 85) // Ligne horizontale inf refs 
      doc.setLineWidth(0.1);
      doc.line(150, 85, 150, 257) // Ligne Verticale gauche conformité
      doc.setLineWidth(0.1);
      doc.line(150, 95, 200, 95) // Ligne bas Conformité
      doc.setLineWidth(0.1);
      doc.line(10, 105, 200, 105) // Ligne bas Oui/Non 
      doc.setLineWidth(0.1);
      doc.line(175, 95, 175, 257) // Séparateur conformité
      doc.setLineWidth(0.1);
      doc.line(10, 176, 200, 176) // Séparateur maintenance type
      doc.setLineWidth(0.1);

      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Opérateur", 40, 262, null, null, "center");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Nom:", 11, 268, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text(valeurnom, 21, 268, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Prénom:", 11, 273, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text(valeurprenom, 26, 273, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Date:", 11, 278, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text(valeurdate, 21, 278, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Visa:", 11, 283, null, null, "left");

      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Responsable MCO", 105, 262, null, null, "center");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Nom:", 71, 268, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Prénom:", 71, 273, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Date:", 71, 278, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Visa:", 71, 283, null, null, "left");

      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Responsable Qualité", 170, 262, null, null, "center");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Nom:", 141, 268, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Prénom:", 141, 273, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Date:", 141, 278, null, null, "left");
      doc.setFontSize(10);  // Définir la taille de police à 12 points
      doc.text("Visa:", 141, 283, null, null, "left");

      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("WGTID :", 40, 55, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(valeurWGTID, 39, 62, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Code RF :", 105, 54, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(valeurCodeRF, 105, 62, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Fournisseur / Fabricant :", 170, 54, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(valeurFournisseur, 170, 62, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Bâtiment :", 40, 69, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(valeurBatiment, 40, 77, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Salle :", 105, 69, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(valeurSalle, 105, 77, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Date dernière MCO :", 170, 69, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(valeurDate, 170, 77, null, null, "center");

      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Conforme", 175, 90, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Oui (O)", 162.5, 100, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(conformVisuO, 162.5, yPosition2, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Non (N)", 187.5, 100, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(conformVisuN, 187.5, yPosition2, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Oui (O)", 162.5, 100, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(conformMecaO, 162.5, yPosition3, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Non (N)", 187.5, 100, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text(conformMecaN, 187.5, yPosition3, null, null, "center");


      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Contrôle Visuel", 11, 109, null, null, "left");
      textLines2.forEach((line, index) => {
      doc.setFontSize(12);
      doc.text(line, xPosition1, yPosition2 + index * lineHeight2);
      });

      doc.setLineWidth(0.1);
      doc.line(10, 110, 41, 110) // Cadre texte
      doc.setLineWidth(0.1);
      doc.line(41, 110, 41, 105) // Cadre texte

      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("Action mécanique", 11, 180, null, null, "left");
      textLines3.forEach((line, index) => {
      doc.setFontSize(12);
      doc.text(line, xPosition1, yPosition3 + index * lineHeight2);
      });

      doc.setLineWidth(0.1);
      doc.line(10, 181, 46, 181) // Cadre texte
      doc.setLineWidth(0.1);
      doc.line(46, 181, 46, 176) // Cadre texte
      textLines1.forEach((line, index) => {
      doc.setFontSize(10);
      doc.text(line, xPosition1, yPosition1 + index * lineHeight1);
      });

      doc.setFontSize(16);  // Définir la taille de police à 12 points
      doc.text("RJH Lot D10", 105, 15, null, null, "center");
      doc.setFontSize(12);  // Définir la taille de police à 12 points
      doc.text("MCO - Suivi stockage et maintenance", 105, 25 , null, null, "center");
  
  if (!imageCache) {
        console.error("Aucune image n'est présente dans le cache.");
        
      }
      // Vérifier si une image est présente dans le cache
      if (imageCache) {
        // Ajouter une nouvelle page
        doc.addPage();
        // Utiliser la fonction addImage de jsPDF
        doc.addImage(imageCache, 'JPEG', 55, 10, 133, 100);
        doc.save(valeurCodeRF + '.pdf');
      } else {
        
          doc.save(valeurCodeRF + '.pdf');
          console.log("PDF généré avec succès.");
      }

      //Envoi du PDF généré au serveur
  //Configurer Email.js avec votre User ID
emailjs.init("hyPJumy2Kqvs0U0lm");

 //Envoyer l'e-mail avec le fichier PDF attaché
 var params = {
  to_email: toemail, // Adresse e-mail du destinataire
  from_name: "MCO", // Votre nom
  message: "Bonjour ", // Message du e-mail
  user: nomdestinataire,
}
//Utiliser le service Email.js pour envoyer l'e-mail
emailjs.send("service_mcobocc", "template_d4h1b4r", params)
  .then(function(response) {
      console.log("E-mail envoyé avec succès", response);
  }, function(error) {
      console.log("Erreur lors de l'envoi de l'e-mail", error);
  });
}