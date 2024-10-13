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

  // * Réinitialisation de la section projets avant d'afficher de nouveaux projets
  resetSectionProjets();

  // * Filtrage des projets par catégorie si un filtre est sélectionné
  if ([1, 2, 3].includes(id)) {
    data = data.filter((data) => data.categoryId == id); // * Filtre les projets par categoryId si l'ID est 1, 2 ou 3
  }

  // * Mise à jour de la couleur des boutons en fonction du filtre sélectionné
  document.querySelectorAll(".filter__btn").forEach((btn) => {
    btn.classList.remove("filter__btn--active"); // * Supprime la classe active de tous les boutons
  });
  document
    .querySelector(`.filter__btn-id-${id}`)
    .classList.add("filter__btn--active"); // * Ajoute la classe active au bouton sélectionné

  // ! Si aucun projet n'est trouvé ou si data est indéfini
  if (data.length === 0 || data === undefined) {
    const p = document.createElement("p"); // ! Crée un nouvel élément <p> pour afficher un message d'erreur
    p.classList.add("error");
    p.innerHTML =
      "Aucun projet à afficher <br><br>Toutes nos excuses pour la gêne occasionnée."; // ! Message d'erreur pour l'utilisateur
    sectionProjets.appendChild(p); // ! Ajoute ce message à la section des projets
    return; // ! Sort de la fonction
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

// * Empêche la propagation de l'événement de clic pour éviter la fermeture accidentelle de la modale
const stopPropagation = function (e) {
  e.stopPropagation(); // * Empêche la propagation de l'événement
};

// * Ajoute les événements pour ouvrir la modale
document.querySelectorAll(".js-modale").forEach((a) => {
  a.addEventListener("click", openModale); // * Ajoute l'événement d'ouverture
});

// * Ferme la modale si l'utilisateur appuie sur la touche Échap
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModale(e); // * Ferme la modale si Échap est pressé
    closeModaleProjet(e); // * Ferme la modale projet aussi
  }
});

////////////////////////////////////////////////////
// INDEX : 2-//// GESTION TOKEN LOGIN //////////////
////////////////////////////////////////////////////

// * Récupère le token de l'utilisateur (s'il est connecté)
const token = localStorage.getItem("token"); // * Récupère le token depuis le localStorage
const AlredyLogged = document.querySelector(".js-alredy-logged"); // * Sélectionne l'élément qui affiche le statut de connexion
const adminRod = document.querySelector(".admin__rod"); // * Sélectionne la barre noire admin
const adminModifierButtons = document.querySelectorAll(".admin__modifer"); // * Sélectionne tous les boutons "Modifier"

adminPanel(); // * Gère les boutons admin en fonction du token

// * Fonction pour afficher les boutons d'administration si l'utilisateur est connecté
function adminPanel() {
  if (token) {
    // * L'utilisateur est connecté
    AlredyLogged.innerHTML = "logout"; // * Change le texte du bouton de login

    // * Affiche la barre noire
    adminRod.style.display = "flex"; // * Affiche la barre noire en mode flex

    // * Affiche tous les boutons "Modifier"
    adminModifierButtons.forEach((btn) => {
      btn.removeAttribute("aria-hidden"); // * Rend les boutons visibles
      btn.style.display = "flex"; // * Affiche chaque bouton "Modifier"
    });

    // * Gère la déconnexion
    AlredyLogged.addEventListener("click", function () {
      localStorage.removeItem("token"); // Supprime le token pour déconnecter
      window.location.reload(); // Recharge la page pour refléter le changement
    });
  } else {
    // Si l'utilisateur n'est pas connecté, la barre reste cachée et les boutons "Modifier" aussi
    adminRod.style.display = "none";
    adminModifierButtons.forEach((btn) => {
      btn.setAttribute("aria-hidden", "true"); // Cache les boutons
      btn.style.display = "none"; // Cache les boutons "Modifier"
    });
  }
}

////////////////////////////////////////////////////////////
// INDEX : 3-// GESTION SUPPRESSION D'UN PROJET /////////////
////////////////////////////////////////////////////////////

// * Fonction qui ajoute des événements de suppression aux boutons
function deleteWork() {
  let btnDelete = document.querySelectorAll(".js-delete-work");
  for (let i = 0; i < btnDelete.length; i++) {
    btnDelete[i].addEventListener("click", deleteProjets); // * Ajoute un événement de clic à chaque bouton de suppression
  }
}

// * Fonction pour supprimer un projet
async function deleteProjets() {
  const confirmation = window.confirm(
    "Êtes-vous sûr de vouloir supprimer cette image ?"
  );
  if (!confirmation) {
    return;
  }

  // * Envoie une requête DELETE pour supprimer le projet
  await fetch(`http://localhost:5678/api/works/${this.classList[0]}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (response.status === 204) {
        refreshPage(this.classList[0]); // * Rafraîchit la liste des projets après suppression
      } else if (response.status === 401) {
        alert("Vous n'êtes pas autorisé à supprimer ce projet.");
        window.location.href = "login.html"; // * Redirige vers la page de connexion
      }
    })
    .catch((error) => {
      console.log(error); // ! Affiche l'erreur dans la console si la requête échoue
    });
}

// * Fonction pour rafraîchir la page après suppression sans recharger entièrement
async function refreshPage(i) {
  modaleProjets(); // * Relance la génération des projets dans la modale admin

  const projet = document.querySelector(`.js-projet-${i}`); // * Sélectionne l'élément projet
  projet.style.display = "none"; // * Cache cet élément projet
}

////////////////////////////////////////////////////
// INDEX : 4-/ GESTION BOITE MODALE AJOUT PROJET ///
////////////////////////////////////////////////////

// * Ouverture de la modale pour ajouter un projet
let modaleProjet = null;
const openModaleProjet = function (e) {
  e.preventDefault(); // * Empêche l'action par défaut
  modaleProjet = document.querySelector(e.target.getAttribute("href")); // * Sélectionne la modale projet

  modaleProjet.style.display = null; // * Affiche la modale projet
  modaleProjet.removeAttribute("aria-hidden"); // * Supprime aria-hidden
  modaleProjet.setAttribute("aria-modal", "true"); // * Ajoute aria-modal

  modaleProjet
    .querySelector(".js-modale-close")
    .addEventListener("click", closeModaleProjet); // * Ferme la modale via bouton
  modaleProjet
    .querySelector(".js-modale-stop")
    .addEventListener("click", stopPropagation); // * Empêche fermeture sur clic intérieur
};

// * Fermeture de la modale projet
const closeModaleProjet = function (e) {
  if (modaleProjet === null) return;

  modaleProjet.setAttribute("aria-hidden", "true");
  modaleProjet.removeAttribute("aria-modal");

  modaleProjet
    .querySelector(".js-modale-close")
    .removeEventListener("click", closeModaleProjet);
  modaleProjet.style.display = "none"; // * Cache la modale projet
  modaleProjet = null;
};

////////////////////////////////////////////////////
// INDEX : 5-/ GESTION AJOUT D'UN PROJET        ///
////////////////////////////////////////////////////

// Sélection des éléments du formulaire
// Sélection des éléments du formulaire
const btnAjouterProjet = document.querySelector(".js-add-work");
const titleInput = document.querySelector(".js-title");
const imageInput = document.querySelector(".js-image");
const photoIcon = document.querySelector(".form-group-photo i");
const imagePreview = document.querySelector("#image-preview");
const imagePreviewContainer = document.querySelector(
  ".image-preview-container"
);

// Fonction pour vérifier si les champs sont remplis et activer le bouton
function checkFormValidity() {
  if (titleInput.value !== "" && imageInput.files.length > 0) {
    btnAjouterProjet.classList.remove("btn-disabled"); // Supprime la classe "btn-disabled"
    btnAjouterProjet.disabled = false; // Active le bouton
  } else {
    btnAjouterProjet.classList.add("btn-disabled"); // Ajoute la classe "btn-disabled"
    btnAjouterProjet.disabled = true; // Désactive le bouton
  }
}

// Fonction pour afficher l'aperçu de l'image
function previewImage() {
  const file = imageInput.files[0]; // Récupérer le fichier sélectionné
  if (file) {
    const reader = new FileReader();

    // Quand le fichier est chargé, afficher l'aperçu
    reader.addEventListener("load", function () {
      imagePreview.src = reader.result; // Mettre à jour la source de l'image avec l'URL
      imagePreview.classList.add("image-added"); // Ajouter la classe pour forcer l'affichage
      imagePreviewContainer.style.display = "block"; // Afficher le conteneur de prévisualisation
      photoIcon.style.display = "none"; // Cacher l'icône
    });

    reader.readAsDataURL(file); // Lire le fichier image sous forme d'URL
  }
}

// Fonction pour réinitialiser l'aperçu de l'image
function resetImagePreview() {
  imagePreview.src = ""; // Vider la source de l'image
  imagePreview.classList.remove("image-added"); // Supprimer la classe qui force l'affichage
  imagePreviewContainer.style.display = "none"; // Cacher le conteneur de prévisualisation
  photoIcon.style.display = "block"; // Remettre l'icône visible
  imageInput.value = ""; // Vider le champ de fichier
}

// Désactive le bouton par défaut au chargement de la page
btnAjouterProjet.classList.add("btn-disabled");
btnAjouterProjet.disabled = true;

// Écouteurs d'événements pour vérifier les changements dans les champs de formulaire
titleInput.addEventListener("input", checkFormValidity);
imageInput.addEventListener("change", () => {
  checkFormValidity();
  previewImage(); // Appeler la fonction pour afficher l'image
});

// Réinitialiser l'image lorsque la page ou la modale est fermée
window.addEventListener("beforeunload", resetImagePreview);
document
  .querySelector(".js-modale-close")
  .addEventListener("click", resetImagePreview);

// * Ajoute l'événement clic pour soumettre le formulaire seulement si les champs sont valides
btnAjouterProjet.addEventListener("click", addWork);

// * Fonction pour ajouter un projet
async function addWork(event) {
  event.preventDefault(); // Empêche l'envoi du formulaire par défaut

  // Récupération des valeurs du formulaire
  const title = titleInput.value;
  const categoryId = document.querySelector(".js-categoryId").value;
  const image = imageInput.files[0];

  // Vérification que tous les champs sont remplis
  if (title === "" || categoryId === "" || !image) {
    alert("Merci de remplir tous les champs");
    return;
  }

  try {
    // Création d'un objet FormData pour envoyer les données du projet
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", categoryId);
    formData.append("image", image);

    // Envoi des données via une requête POST à l'API
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    // Gestion des réponses du serveur
    if (response.status === 201) {
      alert("Projet ajouté avec succès :)");
      modaleProjets(); // Réaffiche les projets dans la modale admin
      generationProjets(data, null); // Rafraîchit la page d'accueil
      resetImagePreview(); // Réinitialise l'aperçu de l'image après l'ajout
    } else if (response.status === 400) {
      alert("Merci de remplir tous les champs");
    } else if (response.status === 500) {
      alert("Erreur serveur");
    } else if (response.status === 401) {
      alert("Vous n'êtes pas autorisé à ajouter un projet");
      window.location.href = "login.html"; // Redirige vers la page de connexion
    }
  } catch (error) {
    console.log(error); // Gestion des erreurs
  }
}
