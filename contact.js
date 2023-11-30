function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
    }  

    function sendEmail() {
        var fromemail = document.getElementById('textemail').value;
        var nomdestinataire = document.getElementById('nom').value;
        var prenomdestinataire = document.getElementById('prenom').value;
        var contenu = document.getElementById('zonetexte').value;
        var to_email = "edassonville@arkadia-ing.com";
        var formulaire = document.getElementById('formulaire-container');
        var merci = document.getElementById('confirmation-container');

        emailjs.init("hyPJumy2Kqvs0U0lm");

 //Envoyer l'e-mail avec le fichier PDF attaché
 var params = {
  to_email: to_email, // Adresse e-mail du destinataire
  from_email: fromemail, // Adresse e-mail de l'expéditeur
  from_name: nomdestinataire, // Nom
  from_surname: prenomdestinataire, // Prénom 
  message: contenu, // Message du e-mail
}
//Utiliser le service Email.js pour envoyer l'e-mail
emailjs.send("service_mcobocc", "template_dqj8yx8", params)
  .then(function(response) {
      console.log("E-mail envoyé avec succès", response);
      formulaire.style.display = 'none';
      merci.style.display ='block';
  }, function(error) {
      console.log("Erreur lors de l'envoi de l'e-mail", error);
  });
}