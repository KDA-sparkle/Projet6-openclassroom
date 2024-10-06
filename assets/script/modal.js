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

// * Fonction pour générer et afficher les projets dans la modale admin
async function modaleProjets() {
  const response = await fetch("http://localhost:5678/api/works"); // * Récupère les projets via l'API
  dataAdmin = await response.json(); // * Transforme la réponse en JSON
  resetmodaleSectionProjets(); // * Réinitialise la section projets

  for (let i = 0; i < dataAdmin.length; i++) {
    const div = document.createElement("div"); // * Crée un élément <div> pour chaque projet
    div.classList.add("gallery__item-modale");
    modaleSectionProjets.appendChild(div); // * Ajoute ce projet à la section

    const img = document.createElement("img"); // * Crée un élément <img>
    img.src = dataAdmin[i].imageUrl; // * URL de l'image
    img.alt = dataAdmin[i].title; // * Texte alternatif
    div.appendChild(img); // * Ajoute l'image

    const p = document.createElement("p"); // * Crée un élément <p> pour le titre et l'ID du projet
    div.appendChild(p);
    p.classList.add(dataAdmin[i].id, "js-delete-work"); // * Identifiant pour la suppression

    const icon = document.createElement("i"); // * Crée une icône de suppression (corbeille)
    icon.classList.add("fa-solid", "fa-trash-can");
    p.appendChild(icon); // * Ajoute l'icône

    const a = document.createElement("a"); // * Crée un lien pour l'édition du projet
    a.innerHTML = "Éditer";
    div.appendChild(a); // * Ajoute le lien
  }
  deleteWork(); // * Ajoute des événements pour la suppression de projet
}

// * Fonction pour fermer la modale
const closeModale = function (e) {
  e.preventDefault(); // * Empêche l'action par défaut du lien
  if (modale === null) return; // * Sort si déjà fermé

  modale.setAttribute("aria-hidden", "true"); // * Rend la modale invisible
  modale.removeAttribute("aria-modal"); // * Supprime aria-modal
  modale
    .querySelector(".js-modale-close")
    .removeEventListener("click", closeModale); // * Supprime l'événement de fermeture

  // * Ferme la modale avec une animation de 300ms
  window.setTimeout(function () {
    modale.style.display = "none"; // * Cache la modale
    modale = null; // * Réinitialise la variable modale
    resetmodaleSectionProjets(); // * Réinitialise la section projets de la modale
  }, 300);
};

////////////////////////////////////////////////////
// INDEX : 2-//// GESTION TOKEN LOGIN //////////////
////////////////////////////////////////////////////

// * Récupère le token de l'utilisateur (s'il est connecté)
const token = localStorage.getItem("token"); // * Récupère le token depuis le localStorage
const AlredyLogged = document.querySelector(".js-alredy-logged"); // * Sélectionne l'élément qui affiche le statut de connexion

adminPanel(); // * Gère les boutons admin en fonction du token

// * Fonction pour afficher les boutons d'administration si l'utilisateur est connecté
function adminPanel() {
  document.querySelectorAll(".admin__modifer").forEach((a) => {
    if (token === null) {
      return; // * Si aucun token, l'utilisateur n'est pas connecté
    } else {
      a.removeAttribute("aria-hidden"); // * Affiche les boutons pour les utilisateurs connectés
      a.removeAttribute("style"); // * Supprime les styles CSS qui cachent les boutons
      AlredyLogged.innerHTML = "deconnexion"; // * Change le texte du bouton
    }
  });
}
