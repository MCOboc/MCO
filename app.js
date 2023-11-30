const XLSX = require('xlsx');
const fs = require('fs');
const { format } = require('date-fns');
const { utcToZonedTime, formatToTimeZone } = require('date-fns-tz');

const excelFile = 'MCO2.xlsx'; // Remplacez par le chemin de votre fichier Excel
const workbook = XLSX.readFile(excelFile);

const sheetName = workbook.SheetNames[2]; // Obtenez la troisième feuille de calcul
const worksheet = workbook.Sheets[sheetName];

// Liste des clés de colonnes à conserver
const columnsToKeep = ["Bâtiment", "WGTID", "Circuit", "Code RF", "N° SPA", "Fournisseur", "Désignation complète / modèle", "Finale RJH complète", "Saisie boctrack (O/N)", "Dernière MàJ Boctrack", "Documents", "Date dernière MCO", "Fréquence(j)", "Prochaine MCO", "Contrôle Visuel", "Action mécanique"]; // Ajoutez d'autres colonnes au besoin

// Convertissez les données de la feuille de calcul en tableau d'objets JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet, {
  raw: false, // Utilisez false pour conserver les dates en tant qu'objets Date
});

// Sélectionnez les colonnes à conserver et formatez les dates
const selectedData = jsonData.map(row => {
  const selectedRow = {};
  columnsToKeep.forEach(column => {
    if (row[column] instanceof Date) {
      const zonedTime = utcToZonedTime(row[column], 'Europe/Paris');
      selectedRow[column] = formatToTimeZone(zonedTime, 'dd/MM/yyyy', { timeZone: 'Europe/Paris' });
    } else {
      selectedRow[column] = row[column];
    }
  });
  return selectedRow;
});

// Enregistrez les données JSON sélectionnées dans un fichier
fs.writeFileSync('donnees.json', JSON.stringify(selectedData, null, 2));

