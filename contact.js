window.onload = function() {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        emailjs.init("hyPJumy2Kqvs0U0lm");

        // Envoyer l'e-mail avec le fichier PDF attaché
        var params = {
            to_email: toemail, // Adresse e-mail du destinataire
            from_name: "MCO", // Votre nom
            message: "Bonjour ", // Message du e-mail
            user: nomdestinataire,
        }
        // Utiliser le service Email.js pour envoyer l'e-mail
        emailjs.send("service_mcobocc", "template_d4h1b4r", params)
            .then(function(response) {
                console.log("E-mail envoyé avec succès", response);
            }, function(error) {
                console.log("Erreur lors de l'envoi de l'e-mail", error);
            });
    });
}