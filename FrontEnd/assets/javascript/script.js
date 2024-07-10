
// document.addEventListener("DOMContentLoaded", () => { //// effectue la meme tache que defer dans l'html
    let objWorks = [] // Variable contenant un tableau qui aura les donnés de l'API GET a l'interieur 
    document.addEventListener("click",(e)=>{ // Optimisation des ressources et geres les données de l'API pour les boutons de filtres
        let clickElement = e.target //recupere l'element clicker
        let clickId = clickElement.id //recupere l'attribut ID de l'element clicker
        switch (clickId) { // expression (clickID) à comparer avec chacune des clause (ID des boutons)
            case "btn_tous":
                fctFiltre(clickElement,0)
                break

            case "btn_objet":
                fctFiltre(clickElement,1)
                break

            case "btn_appartement":
                fctFiltre(clickElement,2)
                break

            case "btn_hotelrestaurant":
                fctFiltre(clickElement,3)
                break
                
            default :
                break
        }
    })
    
    /**DisplayWorks()
     *  Permet d'integrer les travaux dynamiquement dans gallery
     * @param {object} data [Prototype] : reponse Json par l'API
     */
    function displayWorks (data){
        deleteGallery()
        for (let key in data){ // on itère dans notre objet JSON pour récupérer les données
            // On récupère notre élément du DOM
            const gallery = document.querySelector(".gallery") 
            // On créer les éléments manquants au DOM
            const figureElement = document.createElement("figure")
            figureElement.classList.add(`js-travaux-${data[key].id}`) // Ajout d'une class a figureElement
            const imageElement = document.createElement("img")
            const figcaptionElement = document.createElement("figcaption")
            // On nourris les éléments précédements créer               
            imageElement.src = data[key].imageUrl              
            figcaptionElement.innerHTML = data[key].title
            // On utilise le siblings pour ajouter les éléments fraichement créés au DOM
            gallery.appendChild(figureElement)
            figureElement.appendChild(imageElement)
            figureElement.appendChild(figcaptionElement)
        }
    }

    /**DeleteGallery()
      * Permet d'effacer la gallery de travaux
      */
    function deleteGallery() {
        const gallery = document.querySelector(".gallery");
        while (gallery.firstChild) {
            gallery.removeChild(gallery.firstChild);
        }
    }
    
   /**fctFiltre
    * permet de filtrer et de changer la couleur des differents filtres
    * @param {*} elem 
    * @param {*} catId 
    * @returns 
    */
    function fctFiltre (elem,catId) {
        const btn = document.querySelectorAll("button[id^='btn_']")//recuperer TOUS les boutons du html et pas seulement le 1er element +selecteur CSS pour preciser un boutton
        for (let i = 0; i < btn.length ; i++){ // parcours mon tableau qui contient les boutons 
            if (elem.Id === btn[i].id){ // Si l'ID du bouton cliquer est egal a l'ID du bouton qu'on compare alors on change la couleur de fond et de texte
                elem.setAttribute(`style`,`background-color:#1D6154 ;color:white`)
                
            }else{// Sinon on enleve l'attibut style , qui remet le bouton par defaut 
                btn[i].removeAttribute("style")
            }
        }
        if(catId === 0){ 
            displayWorks(objWorks) // joue une fonction qui permet de cree les elements HTMl avec objWork pour y injecter les données de l'API
            return false
        }
        const worksFiltered = objWorks.filter((data)=>{
            return data.categoryId === catId
        })
        displayWorks(worksFiltered)
    }

    /**ColorNav()
     * permet de changer le style des elements de navigation au click
     */
    function colorNav() {
        const nav = document.querySelectorAll("li") // Recuperer tous les elements li du HTMl et les rentrent dans un tableau JS.
        nav.forEach(element =>{ // Boucle forEach, permet d'exécuter une fonction donnée sur chaque élément du tableau.
            element.addEventListener('click',(e)=>{ //Ajout d'un ecouteur d'evenement pour chaque elements du tableau.
                navInnerText = e.currentTarget.innerText // Recuperer l'InnerText de l'elements qui est cliquer.
                for(let i = 0 ; i < nav.length ; i++){ //Parcours mon tableau qui contient les elements.
                    if ( navInnerText === nav[i].innerText){ //Si l'InnerText de l'element cliquer et le meme que l'InnerText de l'element du tableau alors on change le style.
                        e.currentTarget.setAttribute(`style`,`font-weight: bold;`)
                    }else{ //Sinon on restore le style par defaut.
                        nav[i].removeAttribute(`style`)  
                    }
                }       
            })
        })
    }
    colorNav()

   /**GetApiResponse()
    * fonction asynchrone,appelle a l'API puis recupere la reponse et affiche les resultats
    * @param {url} url [string] de la requete GET
    */
    async function getApiResponse (url){        
        try{
            fetch(url) // Requete GET par defauts
                .then( response => response.json() )
                .then((response) => {
                    objWorks = response // Attribue la reponse de l'API à objWorks 
                    displayWorks(objWorks) // Appelle la fonction displayWorks
                })
                .catch( (error) => console.log("Erreur : " + error))            
        }catch{
            alert(("Erreur : "+ response.error))
        }
    }
    getApiResponse("http://localhost:5678/api/works/") // Appelle la fonction getApiResponse avec l'URL de l'API pour recuperer les travaux et les travaux dynamiquement

    /**Deconnect()
     * permet la deconnection de l'utilisateur au click
     */
    function deconnect() {
        try {
            const login = document.querySelector(".login_logout")
            if (localStorage.getItem("token")) { //Si le token est enregistrer dans le LocaleStorage alors 
                login.textContent = "Déconnexion" // change le texte Login par Logout si le token est enregistrer dans LocaleStorage 
                console.log("Vous etes connecter !")
                // Ajout un ecouteur d'evenement au click sur Login
                login.addEventListener("click",(e)=>{
                    e.preventDefault()  // Empêche l'envoi par défaut du formulaire par le navigateur, l'envoi est géré par notre code JavaScript
                    localStorage.removeItem("token") // efface le token dans le LocaleStorage
                    window.location.href = "assets/logIn.html" // redigire vers la page logIn.html
                })
            }
        } catch (error) {
            alert("erreur:"+error)  
        }
    }

    deconnect()

    /**AspectConnect()
     * Permet de mettre en place la page html en mode edition 
     */
    function aspectConnect() {
        try {
            const blackBar = document.getElementById("blackBar")
            const btnFiltres = document.getElementById("btn")
            const modifier = document.getElementById("modifier")
            if (localStorage.getItem("token")) {
            blackBar.setAttribute(`style`,`display: flex;`)
            btnFiltres.setAttribute(`style`,`display: none`)
            modifier.setAttribute(`style`,`display: flex;`)
            }
        } catch (error) {
            alert("erreur:"+ error)
        }
    }
    aspectConnect()

    //-------------------------------------------------------------------------MODAL------------------------------------------------------------------------------//
    //-----------Modal Admin-------------//
    let modal = null 

    /**OpenModal()
     * Permet d'ouvrir la page Modal en cliquant sur modifier
     * @param {*} e 
     */
    const openModal = function (e) {
        e.preventDefault()
        const target = document.querySelector(e.target.getAttribute("href")) 
        target.style.display = null
        target.removeAttribute("aria-hidden")
        target.setAttribute("aria_modal","true") 
        modal = target 
        modal.addEventListener("click", closeModal)
        modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
        modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
        document.querySelector(".js-modal-projet").addEventListener("click",openModaleProjet)
    }

    /**CloseModal()
     * Permet de quitter la page Modal et d'effacer sont code proprement 
     * @param {*} e
     * @returns 
     */
    const closeModal = function (e) {
        if (modal === null) return
        e.preventDefault()
        modal.style.display = "none"
        modal.setAttribute("aria-hidden", "true")
        modal.removeAttribute("aria-modale")
        modal.removeEventListener("click", closeModal)
        modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
        modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
        modal = null 
    }

    document.querySelectorAll(".js-modal").forEach(a =>{
        a.addEventListener("click", openModal)
    })

    /**StopPropagation()
     * Permet de cliquer dans la page Modal sans nous sortir de la page Modal (Stop la propagation de l'eventement)
     * @param {*} e 
     */
    const stopPropagation = function (e) {
        e.stopPropagation()
    }

    /**
     * Quitte la page Modal en appuyant sur la touche "Echap" du clavier
     */
    window.addEventListener("keydown",function(e){
        try {
            if (e.key === 'Escape' || e.key === 'Esc') {
            closeModal(e)
            closeModalProjet(e)
            }
        } catch (error) {
            alert("erreur:"+error)
        }
        
    })

      //--------------------------Ajout des travaux dans la modal---------------------------------//

    /**Photos()
     * récupere les differents travaux de l'API (URL et ID) seulement 
     * @param {*} works reponse Json par l'API 
     */
    function photos(works) {
        const photo_modal = `
                <figure class ="T${works.id}">
            
                    <div id="repertoire_modal" class="photo_model_efface">
                        <img src="${works?.imageUrl} "crossOrigin="anonymous">
                        <p class="${works.id} js-delete-work">
                            <i class="fa-solid fa-trash-can"></i>
                        </p>
                    </div>
                        
                </figure>`
    
        document.getElementById("gallery-modal").insertAdjacentHTML("beforeend", photo_modal)
    }

    /**AfficheModal()
     * affiche la totalité des travaux dans la page Modal
     * fonction de type asynchrone
     */
    async function afficheModal() {
        try {
            fetch("http://localhost:5678/api/works").then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        document.getElementById("gallery-modal").innerHTML = ""// Efface le HTML à l'intérieur de la modal
                        // Boucle à travers toutes les photos dans le tableau de données pour les afficher dans la modal admin
                        for (let i = 0; i <= data.length - 1; i++) {
                            photos(data[i]);
                        }
                        deleteWork()//Appelle a la fonction deleteWork()
                    })
                }
            })
        } catch (error) {
            alert("erreur:"+error)
        }
    }
        
    afficheModal() //Appelle a la fonction afficheModal()

    //------------------------------suppression des travaux dans la modale-------------------------------//

    // Récupération du token
    const token = localStorage.getItem("token")
    
    /**DeleteWork()
     * Event listener sur les boutons supprimer par rapport a leur ID
     */
    function deleteWork() {
        try {
            let btnDelete = document.querySelectorAll(".js-delete-work") // recupere tous les boutons poubelle dans la modal admin
            for (let i = 0; i < btnDelete.length; i++) {
                btnDelete[i].addEventListener("click", deleteProjets) //joue deleteProjets quand on click sur un btnDelete
            } 
        } catch (error) {
            alert("erreur:"+error)
        } 
    }

    /**DeleteProjets()
     * supprime les travaux 
     * fonction de type asynchrone
     */
    async function deleteProjets() {
        
        await fetch(`http://localhost:5678/api/works/${this.classList[0]}`,{ 
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`},
        })

        .then (response => {
            // Token good
            if  (response.status === 204){  
                refreshPage(this.classList[0]) 
            }
            // Token incorrect
            else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à supprimer ce projet, merci de vous connecter avec un compte valide")
                window.location.href = "assets/logIn.html"
            }
            else if (response.status === 500) {
                alert("un problème serveur est survenu, Merci de reessayer")
            }
        })
        .catch (error => {
            alert("Erreur"+ error)
        })
    }

    /**RefreshPage()
     * Rafraichit les travaux sans recharger la page
     * fonction de type asynchrone
     * @param {*} i 
     */
    async function refreshPage(i){
        try {
            afficheModal() // Re lance une génération des travauxs dans la modale admin
            // supprime le travaux de la page d'accueil
            const travaux = document.querySelector(`.js-travaux-${i}`)
            travaux.style.display = "none"
        } catch (error) {
            alert("erreur:"+error)
        }
    }

    //------------------------------------------------Modal Ajout de travaux----------------------------------------//

    let modalProjet = null

    /**openModaleProjet
     * Ouvre la page Modal Projet
     * @param {*} e 
     */
    const openModaleProjet = function(e) {
        e.preventDefault()
        modalProjet = document.querySelector(e.target.getAttribute("href"))

        modalProjet.style.display = null
        modalProjet.removeAttribute("aria-hidden")
        modalProjet.setAttribute("aria-modal", "true")

        // Apl fermeture modale
        modalProjet.addEventListener("click", closeModalProjet)
        modalProjet.querySelector(".js-modal-close").addEventListener("click", closeModalProjet)
        modalProjet.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)

        modalProjet.querySelector(".js-modal-return").addEventListener("click", backToModal)
    }

    /**closeModalProjet()
     * Ferme la page Modal Projet
     * @param {*} e 
     * @returns 
     */
    const closeModalProjet = function(e) {
        if (modalProjet === null) return

        modalProjet.setAttribute("aria-hidden", "true")
        modalProjet.removeAttribute("aria-modal")

        modalProjet.style.display = "none"
        modalProjet = null
        
        closeModal(e)
    }

    /**backToModal
     * retourne a la page Modal Admin
     * @param {*} e 
     */
    const backToModal = function(e) {
        e.preventDefault()
        
        modalProjet.style.display = "none"
        modalProjet = null
    }

    //-------Image selectionnée--------//

    /**Telecharger
     * Affiche une vignette de l'image selectionner a l'ajout d'un nouveau travail
     */
    function telecharger() {
        try {
            let telecharger_image = ""
            const reader = new FileReader()
    
            // Ajoute un écouteur d'événements pour charger l'image
            reader.addEventListener("load", () => {
                telecharger_image = reader.result;
                const photo = document.getElementById("image_telecharger")
                document.getElementById("image_telecharger_images").style.display = null
    
                photo.style.backgroundImage = `url(${telecharger_image} )`
            })
    
            reader.readAsDataURL(this.files[0])
        } catch (error) {
            alert("erreur:"+error)
        }
    }
    
    // Ajoute un écouteur d'événements pour télécharger les photos
    document.getElementById("photo").addEventListener("change", telecharger)

    //--------------ajout des travaux-----------//

    const btnAjouterProjet = document.querySelector(".js-add-work")
    btnAjouterProjet.addEventListener("click", addWork)
    
    /**AddWork
     * Ajoute les travaux via l'API 
     * @param {*} event 
     * @returns 
     */
    async function addWork(e) {
        e.preventDefault()

        const title = document.querySelector(".js-title").value //recupere la valeur de champ titre et le rentre dans la constante title
        const categoryId = document.querySelector(".js-categoryId").value //recupere l'ID d'une des trois categories selectionner et le rentre dans la constante caterogyID
        const image = document.querySelector(".js-image").files[0] //recupere l'image selectionner et le rentre dans la constante image

        if (title === "" || categoryId === "" || image === undefined) { // Si un des trois champs est manquant alors un envoi une alert 
            alert("Merci de remplir tous les champs")
            return
        } else if (categoryId !== "1" && categoryId !== "2" && categoryId !== "3") { // Si une autre categorie est selectionner alors on envoi une alert
            alert("Merci de choisir une catégorie valide")
            return
        } else { 
            try {
                const formData = new FormData() // Creation de la fonction FormData et on y accorche les valeurs recuperer precedemment
                formData.append("title", title) 
                formData.append("category", categoryId)
                formData.append("image", image)

                const response = await fetch("http://localhost:5678/api/works", {  // Fonction fetch pour envoyer les nouveaux travaux 
                    method: "POST", // Requete POST pour envoyer le nouveau travail
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData, // Formdata en corps de l'API
                })

                if (response.status === 201) { // Travail ajouté avec succès 
                    alert("Travaux ajouté avec succès !")
                    getApiResponse("http://localhost:5678/api/works/") // Recharge la page avec le nouveau travail poster
                    closeModalProjet({preventDefault: () => true}) // ferme les pages modals 
                } else if (response.status === 400) { // champs manquant 
                    alert("Merci de remplir tous les champs")
                } else if (response.status === 500) { // Serveur non fontionnelle 
                    alert("Erreur serveur");
                } else if (response.status === 401) { // Non autorisation de poster un nouveau travail 
                    alert("Vous n'êtes pas autorisé à ajouter un projet")
                    window.location.href = "assets/logIn.html"
                }
            }
            catch (error) {
               alert("erreur:" + error)
            }
        }
    }
    
// })