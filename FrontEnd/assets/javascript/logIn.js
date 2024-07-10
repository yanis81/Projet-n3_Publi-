const error = document.getElementById("error")
const form = document.getElementById("login-form")
//console.log(form)
form.addEventListener("submit", function (e) { // Écouteur d'événement pour le formulaire de connexion
    e.preventDefault()  // Empêche l'envoi par défaut du formulaire par le navigateur, l'envoi est géré par notre code JavaScript
    //Recupere les entrees du formulaire
    const information = new FormData(form)
    const pay = new URLSearchParams(information)
    //console.log(information);
    // console.log(pay);

    fetch("http://localhost:5678/api/users/login",{
        method: "POST",
        headers: {
            "accept": "application/json",
        },
        body: pay,
    })
    .then((res) => res.json())
    .then((data)=>{
        //console.log(data)
        if ( data.userId === 1){// Si UserId est egal à 1 , on est connecter alors tu stocke le Token et on vas vers index.html
            localStorage.setItem("token", data.token) // Ajout du token dans le LocaleStorage
            //console.log("Vous etes connecter !")
            window.location.href = "../index.html" // Redirige vers index.html
        } else {
            console.log("Une erreur est arriver lors de la connextion, veuillez reessayer !")
            error.innerText = "L'identifiant ou le Mot de passe est incorrect !" // Ajout un texte dans la DIV error pour afficher un message si la connextion est mauvaise
            error.setAttribute(`style`,`font-weight: bold; color: red; align-items: center; font-size:17px;`) //Ajout un style au message d'erreur
            function msgdelete() { //Permet d'effacer le message d'erreur 
                error.innerText = ""
            }
            setTimeout(msgdelete, 59000) //Enlève message d'erreur après 59000 milisecondes (59 secondes)
        }
    })
})

