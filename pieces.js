
import { ajoutListenersAvis,ajoutListenerEnvoyerAvis, afficherGraphiqueAvis } from "./avis.js";

// Recuperation des pieces eventuellements stockées dans le localStorage
let pieces = window.localStorage.getItem('pieces');

//S'il n'y en a pas alors:
if (pieces === null){
    //On fait appel au code existant
    // Récupération des pièces depuis l'API
    const reponse = await fetch('http://localhost:8081/pieces');
    pieces = await reponse.json();
    //Transformations des pieces(Les donnees recue) en JSON
    const valeurPieces = JSON.stringify(pieces);
    //Stockage des informations le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
} else {
    // On le reconstruit en mémoire a l'aide du json.parse
    pieces = JSON.parse(pieces);
}


//Appel fonction ajoutListenerEnvoyer
ajoutListenerEnvoyerAvis();
// Création des balises 
function generePieces(pieces){
    for (let i=0; i<pieces.length; i++) {

        const article = pieces[i];
        
        //Rattachement de nos balises fiches au DOM
        const sectionFiches = document.querySelector(".fiches");
        
        //Creation des elements piece automobile,article,image,nom,prix,categorie,description,stock
        
        const pieceElement = document.createElement("article");
        
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("h4");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
        
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
        
        const stockElement = document.createElement("h5");
        stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";

        //Code ajouté
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";
        
        // On rattache la balise article a la section fiches
        
        sectionFiches.appendChild(pieceElement);
        
        //on rattache la balise piece element a la balise article (img,nom,prix,categorie,description,stock)
        
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        
        
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
          //Code aJouté
        pieceElement.appendChild(avisBouton);
        
        }
        ajoutListenersAvis();
}
generePieces(pieces);

//Gestion des boutons
//trier croissant
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click" , function(){
    const piecesOrdonnees =Array.from(pieces);
    piecesOrdonnees.sort(function (a,b){
        return a.prix - b.prix ;
    });
    document.querySelector(".fiches").innerHTML = "";
    generePieces(piecesOrdonnees);
});
//filtrer prix inferieur 35
const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click" ,function(){
    const piecesFlitrees = pieces.filter(function(piece){
        return piece.prix <= 35;
    })
    document.querySelector(".fiches").innerHTML = "";
    generePieces(piecesFlitrees);

});
//Trier decroissant
const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click" , function(){
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a,b){
        return b.prix - a.prix ;
    });
    document.querySelector(".fiches").innerHTML = "";
    generePieces(piecesOrdonnees);
});
// Filtrer Sans description
const boutonNodesc = document.querySelector(".btn-nodesc");
boutonNodesc.addEventListener("click", () =>{
    const piecesFlitrees = pieces.filter((piece) =>{
         return piece.description
    })
    document.querySelector(".fiches").innerHTML = "";
    generePieces(piecesFlitrees);
});

// fonction map
 const noms = pieces.map(piece => piece.nom)
//liste nom qui ne sont pas abordables
for (let i = pieces.length-1;i>=0;i--){
    if (pieces[i].prix > 35){
        noms.splice(i,1);
    }
}
console.log(noms);
//Creation liste ul et p
const pElement = document.createElement('p')
pElement.innerText = "Pieces Abordables :"
const abordablesElements = document.createElement('ul')

//Ajout elements de chaque liste li
for (let i=0;i<noms.length;i++){
    const nomElement = document.createElement('li')
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement)

};

//ajout de le tete puis de la liste au bloc resultats filtres
document.querySelector(".abordables")
.appendChild(pElement)
.appendChild(abordablesElements)

//Afficher la listes du pieces disponible

// fonction map
const nomsDispo = pieces.map(piece => piece.nom);
const prixDispo = pieces.map(piece => piece.prix);
//liste nom qui ne sont pas abordables
for (let i = pieces.length-1;i>=0;i--){
    if (pieces[i].disponibilite === false){
        nomsDispo.splice(i,1)
        prixDispo.splice(i,1)
    }
};
//Creation liste ul et p
const pElementDisponible = document.createElement('p');
pElementDisponible.innerText = "Pieces Disponibles :";
const disponibleElements = document.createElement('ul');

//Ajout elements de chaque liste li
for (let i=0;i<nomsDispo.length;i++){
        const nomElement = document.createElement('li')
        nomElement.innerText = `${nomsDispo[i]} : ${prixDispo[i]} $`
        disponibleElements.appendChild(nomElement)
}
//ajout de le tete puis de la liste au bloc resultats filtres
document.querySelector(".disponible")
.appendChild(pElementDisponible)
.appendChild(disponibleElements)

// Fonction type range de prix min au max
const inputPrixMax = document.querySelector('#prix-max')
inputPrixMax.addEventListener('input' ,function(){
    const piecesFlitrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value ;
    })
    document.querySelector(".fiches").innerHTML = "";
    generePieces(piecesFlitrees);
})

//Ajout du listener pour mettre a jours des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function() {
//Qui permettra de supprimer avec le contenue du localStorage
window.localStorage.removeItem("pieces");
});

//Appel a la fonction affichGraphiqueAvis
await afficherGraphiqueAvis();



//Efface ecran
//document.querySelector(".fiches").innerHTML = '';
//document.querySelector(".filtres").innerHTML = '';

