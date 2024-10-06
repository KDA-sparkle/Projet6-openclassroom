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
