
function formatDate(dateString) {
    // Vérifier d'abord si la valeur est une date valide
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // Si ce n'est pas une date valide, retournez la valeur d'origine (texte)
        return dateString;
    }

    // Si c'est une date valide, formatez-la
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}


document.addEventListener('DOMContentLoaded', function () {
    const selectBatiment = document.getElementById('bat-dropdown');
    const secondDropdown = document.getElementById('second-dropdown');
    const infotableDiv = document.getElementById('infotable-container');
    const circuits = {};
    let data = [];
    let selectedBatiment;

    // Charger les données JSON depuis un fichier (donnees.json) une seule fois
    fetch('donnees.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            // Vous pouvez effectuer d'autres opérations avec les données ici

            // Charger la liste des bâtiments et des circuits depuis le fichier JSON
            data.forEach(item => {
                const batiment = item['Bâtiment'];
                const circuit = item['Circuit'];

                if (batiment && circuit) {
                    if (!circuits[batiment]) {
                        circuits[batiment] = new Set();
                    }
                    circuits[batiment].add(circuit);
                }
            });

            // Remplissez le premier menu déroulant avec les noms de bâtiments
            for (const batiment in circuits) {
                const option = document.createElement('option');
                option.value = batiment;
                option.textContent = batiment;
                selectBatiment.appendChild(option);
            }
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors du chargement des données JSON :', error);
        });

    // Écoutez les changements dans le premier menu déroulant
    selectBatiment.addEventListener('change', function () {
        selectedBatiment = selectBatiment.value;

        // Cachez le deuxième menu déroulant
        secondDropdown.style.display = 'none';

        // Vérifiez si une option valide a été sélectionnée
        if (selectedBatiment) {
            // Remplissez le deuxième menu déroulant avec les circuits appropriés
            secondDropdown.innerHTML = '';

            // Ajoutez l'option "Voir tout"
            const voirToutOption = document.createElement('option');
            voirToutOption.value = 'Voir Tout';
            voirToutOption.textContent = 'Voir Tout';
            secondDropdown.appendChild(voirToutOption);

            circuits[selectedBatiment].forEach(circuit => {
                const option = document.createElement('option');
                option.value = circuit;
                option.textContent = circuit;
                secondDropdown.appendChild(option);
            });

            // Affichez le deuxième menu déroulant
            secondDropdown.style.display = 'block';
        }
        
    });

    // Écoutez les changements dans le deuxième menu déroulant (Circuit)
    secondDropdown.addEventListener('change', function () {
        const selectedCircuit = secondDropdown.value;

        if (selectedCircuit === "Voir Tout") {
            // Filtrer les données correspondantes au bâtiment sélectionné
            const filteredData = data.filter(item => item['Bâtiment'] === selectedBatiment);
        
            // Créez une div pour contenir le tableau avec une largeur fixe
            const tableContainer = document.createElement('div');
            tableContainer.style.width = '100%';
            tableContainer.style.overflowX = 'auto';
            infotableDiv.innerHTML = '';
            infotableDiv.appendChild(tableContainer);
        
            // Créez le tableau HTML pour afficher les données filtrées
            const table = document.createElement('table');
            tableContainer.appendChild(table);
            table.classList.add('infotable');
        
            // Créez les lignes du tableau pour les données filtrées
            const tbody = document.createElement('tbody');
            const headerRow = document.createElement('tr');
            const thead = document.createElement('thead');
        
            // Utilisez le premier objet du tableau data pour extraire les clés
            const firstDataItem = filteredData[0];
            for (const key in firstDataItem) {
                if (firstDataItem.hasOwnProperty(key)) {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                }
            }
        
            thead.appendChild(headerRow);
            table.appendChild(thead);
        
            filteredData.forEach((item, index) => {
                const row = document.createElement('tr');
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const cell = document.createElement('td');
                        cell.classList.add('left-justify');
                        if (key === 'Date effective stockage sur chantier RJH' || key === 'Date effective fin introduction batiment RJH' || key === 'Date previsionnelle démarrage exploitation' || key === "Date fin garantie constructeur d'origine") {
                            cell.textContent = formatDate(item[key]);
                        } else {
                            cell.textContent = item[key];
                        }
                        row.appendChild(cell);
                    }
                }
                tbody.appendChild(row);
        
                // Ajoutez une ligne de séparation sauf pour la dernière ligne de résultat
                if (index < filteredData.length - 1) {
                    const separatorRow = document.createElement('tr');
                    const separatorCell = document.createElement('td');
                    separatorCell.colSpan = Object.keys(item).length; // Assurez-vous que le séparateur a le bon nombre de colonnes
                    separatorCell.classList.add('separator'); // Classe pour le séparateur
                    separatorRow.appendChild(separatorCell);
                    tbody.appendChild(separatorRow);
                }
        
                // Ajoutez une ligne vide entre chaque résultat sauf pour le dernier
                if (index < filteredData.length - 1) {
                    const emptyRow = document.createElement('tr');
                    const emptyCell = document.createElement('td');
                    emptyCell.innerHTML = '&nbsp;';
                    emptyRow.appendChild(emptyCell);
                    tbody.appendChild(emptyRow);
                }
            });
        
            table.appendChild(tbody);
        } else if (selectedCircuit) {
            // Filtrer les données correspondantes au bâtiment et au circuit sélectionnés
            const filteredData = data.filter(item => item['Bâtiment'] === selectedBatiment && item['Circuit'] === selectedCircuit);

            // Créez une div pour contenir le tableau avec une largeur fixe
            const tableContainer = document.createElement('div');
            tableContainer.style.width = '100%';
            tableContainer.style.overflowX = 'auto';
            infotableDiv.innerHTML = '';
            infotableDiv.appendChild(tableContainer);

            // Créez le tableau HTML pour afficher les données filtrées
            const table = document.createElement('table');
            tableContainer.appendChild(table);
            table.classList.add('infotable');

            // Créez les lignes du tableau pour les données filtrées
            const tbody = document.createElement('tbody');
            const headerRow = document.createElement('tr');
            const thead = document.createElement('thead');

            // Utilisez le premier objet du tableau data pour extraire les clés
            const firstDataItem = filteredData[0];
            for (const key in firstDataItem) {
                if (firstDataItem.hasOwnProperty(key)) {
                    const th = document.createElement('th');
                    th.textContent = key;
                    headerRow.appendChild(th);
                }
            }

            thead.appendChild(headerRow);
            table.appendChild(thead);

            filteredData.forEach((item, index) => {
                const row = document.createElement('tr');
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const cell = document.createElement('td');
                        cell.classList.add('left-justify'); // Ajoutez la classe pour la justification à gauche
                        if (key === 'Date effective stockage sur chantier RJH' || key === 'Date effective fin introduction batiment RJH' || key === 'Date previsionnelle démarrage exploitation' || key === "Date fin garantie constructeur d'origine") {
                            cell.textContent = formatDate(item[key]);
                        } else {
                            cell.textContent = item[key];
                        }
                        row.appendChild(cell);
                    }
                }
                tbody.appendChild(row);

                // Ajoutez une ligne de séparation sauf pour la dernière ligne de résultat
                if (index < filteredData.length - 1) {
                    const separatorRow = document.createElement('tr');
                    const separatorCell = document.createElement('td');
                    separatorCell.colSpan = Object.keys(item).length; // Assurez-vous que le séparateur a le bon nombre de colonnes
                    separatorCell.classList.add('separator'); // Classe pour le séparateur
                    separatorRow.appendChild(separatorCell);
                    tbody.appendChild(separatorRow);
                }

                // Ajoutez une ligne vide entre chaque résultat sauf pour le dernier
                if (index < filteredData.length - 1) {
                    const emptyRow = document.createElement('tr');
                    const emptyCell = document.createElement('td');
                    emptyCell.innerHTML = '&nbsp;';
                    emptyRow.appendChild(emptyCell);
                    tbody.appendChild(emptyRow);
                }
            });

            table.appendChild(tbody);
        }
    });
});
