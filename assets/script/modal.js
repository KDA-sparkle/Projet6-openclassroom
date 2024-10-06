//! ================================ LÉGENDE ================================
//! * Important : Informations essentielles ou instructions importantes.
//! ! Critique : Points à corriger immédiatement, erreurs ou avertissements graves.
//! ? Question : À clarifier, suggestions ou points à discuter.
//! // TODO : Tâches à réaliser plus tard ou améliorations à faire.
//! ========================================================================

/////////////////////////////////////////////////////
// Gestion de la home page /////////////////////////
/////////////////////////////////////////////////////
// * >>> GÉNÉRATION DES PROJETS

// * Sélectionne les boutons de filtre sur la page d'accueil pour filtrer les projets
const btnAll = document.querySelector(".filter__btn-id-null"); // * Bouton qui affichera tous les projets
const btnId1 = document.querySelector(".filter__btn-id-1"); // * Bouton pour filtrer par catégorie 1 (Objets)
const btnId2 = document.querySelector(".filter__btn-id-2"); // * Bouton pour filtrer par catégorie 2 (Appartements)
const btnId3 = document.querySelector(".filter__btn-id-3"); // * Bouton pour filtrer par catégorie 3 (Hôtels & restaurants)

// * Sélection de la section HTML où seront affichés les projets
const sectionProjets = document.querySelector(".gallery"); // * Section où les projets vont être insérés dynamiquement

let data = null; // * Variable pour stocker les données des projets récupérées
let id; // * Stocke l'ID du filtre de projet utilisé

// * Appel initial pour afficher tous les projets
generationProjets(data, null); // * Appelle generationProjets avec null pour afficher tous les projets

// * Fonction pour réinitialiser (vider) la section des projets pour éviter les doublons
function resetSectionProjets() {
  sectionProjets.innerHTML = ""; // * Supprime tout le contenu de la section pour repartir à zéro
}

// * Fonction asynchrone pour générer les projets
// * `data` : ensemble des projets récupérés, `id` : ID du filtre de catégorie (null pour tous les projets)
async function generationProjets(data, id) {
  try {
    // * Récupère tous les projets via une requête GET à l'API
    const response = await fetch("http://localhost:5678/api/works");
    data = await response.json(); // * Transforme la réponse en JSON (tableau d'objets projets)
  } catch {
    // ! Gestion des erreurs en cas d'échec de récupération des projets
    const p = document.createElement("p");
    p.classList.add("error"); // ! Ajoute une classe CSS "error" pour styliser l'erreur
    p.innerHTML =
      "Une erreur est survenue lors de la récupération des projets<br><br>Une tentative de reconnexion automatique aura lieu dans une minute.<br><br>Si le problème persiste, veuillez contacter l'administrateur du site.";
    sectionProjets.appendChild(p); // ! Ajoute le message d'erreur dans la section des projets
    await new Promise((resolve) => setTimeout(resolve, 60000)); // ! Attends 60 secondes avant de tenter une reconnexion
    window.location.href = "index.html"; // ! Redirige vers la page d'accueil après 60 secondes
  }
}

// * Génération et affichage des projets
for (let i = 0; i < data.length; i++) {
  const figure = document.createElement("figure"); // * Crée un élément <figure> pour chaque projet
  sectionProjets.appendChild(figure); // * Ajoute la figure à la section des projets
  figure.classList.add(`js-projet-${data[i].id}`); // * Ajoute un identifiant spécifique au projet

  // * Création de l'image du projet
  const img = document.createElement("img");
  img.src = data[i].imageUrl; // * URL de l'image depuis les données du projet
  img.alt = data[i].title; // * Description (texte alternatif) pour l'accessibilité
  figure.appendChild(img); // * Ajoute l'image à la figure

  // * Création de la légende du projet (titre)
  const figcaption = document.createElement("figcaption");
  figcaption.innerHTML = data[i].title; // * Le titre du projet récupéré depuis les données
  figure.appendChild(figcaption); // * Ajoute la légende à la figure
}

//////////////
// >>> FILTRES

// * Ajout des événements sur les boutons de filtre pour générer les projets correspondants lors du clic
btnAll.addEventListener("click", () => {
  generationProjets(data, null); // * Affiche tous les projets
});

btnId1.addEventListener("click", () => {
  generationProjets(data, 1); // * Filtre par catégorie 1 (Objets)
});

btnId2.addEventListener("click", () => {
  generationProjets(data, 2); // * Filtre par catégorie 2 (Appartements)
});

btnId3.addEventListener("click", () => {
  generationProjets(data, 3); // * Filtre par catégorie 3 (Hôtels & restaurants)
});

/////////////////////////////////////////////////////
// Gestion des modules administrateur ///////////////
/////////////////////////////////////////////////////
// * INDEX : 1- GESTION BOITE MODALE
//            2- GESTION TOKEN LOGIN
//            3- GÉNÉRATION DANS LA MODALE
//            4- GESTION SUPPRESSION PROJET
//            5- GESTION AJOUT PROJET
//            6- GESTION AJOUT D'UN PROJET
/////////////////////////////////////////////////////
// INDEX : 1-// GESTION BOITE MODALE ////////////////
/////////////////////////////////////////////////////

// * Fonction pour réinitialiser (vider) la section des projets dans la modale d'administration
function resetmodaleSectionProjets() {
  modaleSectionProjets.innerHTML = ""; // * Vide la section des projets affichés dans la modale admin
}

// * Ouverture de la modale
let modale = null; // * Variable pour stocker la modale ouverte
let dataAdmin; // * Stocke les projets récupérés pour l'administration
const modaleSectionProjets = document.querySelector(".js-admin-projets"); // * Sélectionne la section où les projets seront affichés dans la modale admin

// * Fonction d'ouverture de la modale admin
const openModale = function (e) {
  e.preventDefault(); // * Empêche l'action par défaut du lien
  modale = document.querySelector(e.target.getAttribute("href")); // * Sélectionne la modale à ouvrir

  modaleProjets(); // * Génère et affiche les projets dans la modale admin

  setTimeout(() => {
    modale.style.display = null; // * Affiche la modale
    modale.removeAttribute("aria-hidden"); // * Supprime l'attribut "aria-hidden"
    modale.setAttribute("aria-modal", "true"); // * Indique que la modale est active
  }, 25); // * Délai avant d'afficher la modale

  document.querySelectorAll(".js-modale-projet").forEach((a) => {
    a.addEventListener("click", openModaleProjet); // * Ajoute l'événement d'ouverture de modale pour chaque projet
  });

  // * Événements de fermeture de la modale
  modale.addEventListener("click", closeModale); // * Ferme la modale si clic en dehors
  modale
    .querySelector(".js-modale-close")
    .addEventListener("click", closeModale); // * Ferme via bouton
  modale
    .querySelector(".js-modale-stop")
    .addEventListener("click", stopPropagation); // * Empêche fermeture au clic intérieur
};
