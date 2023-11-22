function redirectToSearchPage() {
    window.location.href = "search.html";
}

function redirectToBuildingSearch() {
    window.location.href = "batiment.html";
}

function redirectToContactPage() {
    window.location.href = "contact.html";
}

function redirectToAccueilPage() {
    window.location.href = "index.html";
}

function redirectToChoixPage() {
    window.location.href = "choice.html";
}
function redirectToPDFPage() {
    window.location.href = "pdf.html";
}

function displayResults(result) {
    const resultText = document.getElementById('results-text');
    const newSearchButton = document.getElementById('newsearch-button');

    if (result) {
        let resultString = '';

        for (const key in result) {
            const value = result[key];
            resultString += `<span style="text-decoration: underline">${key}</span>: <span style="color: red">${value}</span><br>`;
        }

        resultText.innerHTML = resultString;
        resultText.style.textAlign = 'left'; // Alignement à gauche
        resultText.style.backgroundColor = 'white'; // Fond blanc
    } else {
        resultText.innerHTML = 'Aucune correspondance trouvée.';
        // Masquer le bouton "newsearch-button" s'il n'y a pas de résultats
        newSearchButton.style.display = 'none';
    }
}




function showSearchInput(button) {
    // Récupérer le type du bouton
    const buttonType = button.getAttribute('data-type');

    // Cacher les boutons
    document.getElementById('button-container').style.display = 'none';
    
    // Afficher le champ de recherche
    document.getElementById('search-container').style.display = 'flex';
    document.getElementById('cancel-button').style.display = 'flex';

    // Récupérer l'élément de champ de texte
    const searchInput = document.querySelector('.search-input');

    // Réinitialiser le champ de texte
    searchInput.value = '';

    // Appliquer les contraintes en fonction du bouton
    if (buttonType === 'ref') {
        searchInput.maxLength = 9; // Limite à 9 caractères
        searchInput.pattern = '[A-Z]*'; // Seulement en majuscules
        searchInput.placeholder = 'RSS0010PO';
        searchInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        })
    } else if (buttonType === 'wgtid') {
        searchInput.maxLength = 6; // Limite à 6 caractères
        searchInput.pattern = '[0-9]*'; // Seulement des chiffres
        searchInput.placeholder = '180146';
        searchInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, ''); // Remplace tout sauf les chiffres par une chaîne vide
        })
    }
}

// ... Votre code JavaScript ici ...

function performSearch() {
    // Récupérer le texte saisi dans le champ de recherche
    const searchText = document.getElementById('search-input').value;

    // Vérifier si la zone de texte est vide
    if (searchText.trim() === '') {
        alert('Veuillez saisir un texte de recherche.');
        return; // Arrêter la recherche si la zone de texte est vide
    }

    // Charger le fichier JSON
    fetch('donnees.json')
        .then(response => response.json())
        .then(data => {
            // Effectuer la recherche dans le fichier JSON
            const result = findMatch(data, searchText);

            // Vérifier si une correspondance a été trouvée
            if (result) {
                // Traiter les valeurs correspondantes
                displayResults(result);

                // Cacher la zone de recherche
                document.getElementById('search-container').style.display = 'none';

                // Cacher le bouton "search-button"
                document.querySelector('.search-button').style.display = 'none';

                // Afficher le bouton "newsearch-button"
                document.querySelector('.newsearch-button').style.display = 'block';
            } else {
                alert('Aucune correspondance trouvée.');
            }
        })
        .catch(error => {
            console.error('Erreur lors de la lecture du fichier JSON : ' + error);
        });
}



function startNewSearch() {
    // Réinitialisez la recherche ou effectuez toute autre action souhaitée
    // Affichez à nouveau la zone de recherche
    document.getElementById('search-container').style.display = 'flex';
    
    // Afficher le bouton "search-button"
    document.getElementById('search-button').style.display = 'flex';
    
    // Masquez le bouton "newsearch-button"
    document.getElementById('newsearch-button').style.display = 'none';
}

function findMatch(data, searchText) {
    // Parcourir les données JSON
    for (const item of data) {
        for (const key in item) {
            // Recherchez la correspondance dans toutes les propriétés
            if (item[key].includes(searchText)) {
                return item;
            }
        }
    }
    return null; // Aucune correspondance trouvée
}

function showSearchResults() {
    // Cacher la zone de recherche
    document.getElementById('search-container').style.display = 'none';
}

function startNewSearch() {
    // Réinitialisez la recherche ou effectuez toute autre action souhaitée
    window.location.href = "search.html";
}