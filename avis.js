export function ajoutListenersAvis() {

    const piecesElements = document.querySelectorAll(".fiches article button");
 
    for (let i = 0; i < piecesElements.length; i++) {
 
      // Fonction asynchrone
     piecesElements[i].addEventListener("click", async function (event) {
 
        const id = event.target.dataset.id;
        // Stocker la reponse(Cette reponse est en format JSON) de l API dans une constante
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        // Recuperer les avis en formats JSON
        const avis = await reponse.json();
        //  Nous allons ensuite mettre au DOM ,recuperons l element parent
        const pieceElement = event.target.parentElement;
        //Creeons l element p
        const avisElement = document.createElement("p");
         // Remplissons le contenue html de cette balise p en parcourons les avis(Noms utilisateur et son commentaire)
         for (let i = 0; i < avis.length; i++){
            avisElement.innerHTML += `<b>${avis[i].utilisateur}: <b> ${avis[i].commentaire} <b><br>`;

         }
            pieceElement.appendChild(avisElement);
     });
 
    }
 
 }

 //Creer la fonction AjoutListenerEnvoyerAvis
 export function ajoutListenerEnvoyerAvis() {
   // recuperer la formulaire avis
   const formulaireAvis = document.querySelector(".formulaire-avis");
   // Ajouter adeventListener sur la submit,il declenche lorsque l'utilisateur clique sur envoyer
   formulaireAvis.addEventListener("submit", function(event){
      event.preventDefault();// Pour eviter le rechargement par defaut du navigateur
      //Creer du l'objet du nouvel Avis(Charge utile)
      const avis = {
                     pieceId: parseInt(event.target.querySelector("[name = piece-id]").value),
                     utilisateur: event.target.querySelector("[name = utilisateur]").value,
                     commentaire: event.target.querySelector("[name = commentaire]").value,
                     nbEtoiles: parseInt(event.target.querySelector("[name = nbEtoiles]").value)
      };
      //Creation Charge Utile au format JSON
      const chargeUtile = JSON.stringify(avis);
      //Appel la fonction fetch avec toutes les informations necessaires
      fetch("http://localhost:8081/avis", {
         method: "POST",
         headers:{ "Content-Type": "application/json" }, 
         body: chargeUtile
      });

   });
 }
 //Afficher le graphiqueAvis que nous exporterons
 export async function afficherGraphiqueAvis(){
   // Calcul du nombre total de commentaires par quantité d'étoile attribuées
   // Nous recuperons tous les avis de la plateforme en faisons une requete a l'API http
   const avis =  await fetch("http://localhost:8081/avis").then(avis => avis.json());
   //Calculons le nbre de comentaire pour chaque niveaux d 'etoile initialiser a 0
   const nb_commentaires = [0, 0, 0, 0, 0];

   //Parcourons les avis a l aide d'un boucle for
   for (let commentaire of avis){
      nb_commentaires[commentaire.nbEtoiles - 1]++;
   }
   // Légende qui s'affichera sur la gauche a coté de la barre horizontale
   const labels = ["5", "4", "3", "2", "1"];

   //Données et personnalisation du graphique
   const data = {
         labels: labels,
         datasets: [{
            label: "Etoiles attribuées",
            data: nb_commentaires.reverse(),
            backgroundColor: "rgba(255, 230, 0, 1)", // Couleur Jaune
         }],
   };
   // Objet de configuration Final
   const config = {
      type: "bar",
      data: data,
      options: {
         indexAxis: "y",
      },
   };
   //Rendu graphique dans l'element Canvas
   const graphiqueAvis = new Chart(document.querySelector("#graphique-avis"), 
   config,
   );
   //Correction
   //Recupération des pieces dépuis le localStorage
   const piecesJSON = window.localStorage.getItem("pieces");
   const pieces = JSON.parse(piecesJSON)

   //Calcule du nombre de commentaire 
   let nbCommentairesDispo = 0;
   let nbCommentairsNonDispo = 0;

   // Parcourez les listes des pieces
   for (let i=0; i < avis.length; i++ ){
      const piece = pieces.find(p => p.id === avis[i].pieceId);

      if (piece) {
         if (piece.disponibilite) {
            nbCommentairesDispo++;
         } else {
            nbCommentairsNonDispo++;
         }

      }
   }

   //Légende qui s'affichera sur la gauche a coté de la barre horizontal
   const labelsDispo = ["Disponnibles", "Non Dispo."];

   //Donnée et personnalisation du graphique
   const dataDispo = {
      labels: labelsDispo,
      datasets: [{
         label: "Nombre de commentaire",
         data:[nbCommentairesDispo, nbCommentairsNonDispo],
         backgroundColor:"rgba(0, 230, 255, 1)", //Couleur turquoise

      }],
   };
   // Objet de la configuration final
   const configDispo = {
      type: "bar",
      data: dataDispo,  
   };
   //Rendu graphique dans l'élement Canvas
   new Chart(
      document.querySelector("#graphique-dispo"),
   configDispo,
   );

   
 };
