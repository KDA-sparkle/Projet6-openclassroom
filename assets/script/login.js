//! -------------------------------------------------------------- VARIABLES GLOBALES ----------------------------------------------------------------------

// * Sélection des éléments du DOM pour afficher les messages d'erreur en cas de problème lors de la tentative de connexion.
const alredyLoggedError = document.querySelector(".alredyLogged__error"); // ! Message si l'utilisateur est déjà connecté.
const loginEmailError = document.querySelector(".loginEmail__error"); // ! Message si l'e-mail est incorrect.
const loginMdpError = document.querySelector(".loginMdp__error"); // ! Message si le mot de passe est incorrect.

// * Sélection des champs du formulaire pour l'e-mail et le mot de passe.
const email = document.getElementById("email");
const password = document.getElementById("password");

// * Sélection du bouton de soumission du formulaire.
const submit = document.getElementById("submit");

alredyLogged(); // * Vérification immédiate pour voir si l'utilisateur est déjà connecté.

//! -------------------------------------------------------------- FONCTION DE DÉCONNEXION AUTOMATIQUE ----------------------------------------------------------------------

// * Vérifie si un utilisateur est déjà connecté en cherchant un token dans le localStorage.
// ! Si un token est trouvé, l'utilisateur est déconnecté automatiquement.
function alredyLogged() {
  if (localStorage.getItem("token")) {
    localStorage.removeItem("token"); // ! Suppression du token pour déconnexion.

    // * Création et affichage d'un message indiquant que l'utilisateur a été déconnecté.
    const p = document.createElement("p");
    p.innerHTML =
      "<br><br><br>Vous avez été déconnecté, veuillez vous reconnecter";
    alredyLoggedError.appendChild(p);
    return;
  }
}

//! -------------------------------------------------------------- ÉCOUTE DU FORMULAIRE DE CONNEXION ----------------------------------------------------------------------

// * Gestion de la soumission du formulaire.
// Quand l'utilisateur clique sur le bouton de connexion, on récupère les valeurs saisies (e-mail et mot de passe) et on appelle la fonction login().
submit.addEventListener("click", () => {
  let user = {
    email: email.value, // * Récupération de l'e-mail saisi par l'utilisateur.
    password: password.value, // * Récupération du mot de passe saisi.
  };
  login(user); // ! Appel de la fonction login avec l'objet utilisateur.
});

//! -------------------------------------------------------------- FONCTION LOGIN ----------------------------------------------------------------------

// * Fonction qui gère la connexion de l'utilisateur.
// * Elle vérifie les identifiants puis envoie une requête au serveur pour authentification.
function login(id) {
  console.log(id); // TODO: Vérifier les données dans la console (pour débugger).

  // * Réinitialise les messages d'erreur avant chaque tentative de connexion.
  loginEmailError.innerHTML = "";
  loginMdpError.innerHTML = "";

  // * Validation de l'e-mail à l'aide d'une expression régulière (regex).
  if (!id.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
    const p = document.createElement("p");
    p.innerHTML = "Veuillez entrer une adresse mail valide"; // ! Affiche un message si l'e-mail est incorrect.
    loginEmailError.appendChild(p);
    return; // ! Arrête la fonction si l'e-mail est invalide.
  }

  // * Vérification du mot de passe (au moins 5 caractères et uniquement lettres/chiffres).
  if (id.password.length < 5 && !id.password.match(/^[a-zA-Z0-9]+$/g)) {
    const p = document.createElement("p");
    p.innerHTML = "Veuillez entrer un mot de passe valide"; // ! Affiche un message si le mot de passe est invalide.
    loginMdpError.appendChild(p);
    return; // ! Arrête la fonction si le mot de passe est invalide.
  } else {
    // * Si les identifiants sont valides, on envoie une requête POST au serveur pour vérifier l'utilisateur.
    fetch("http://localhost:5678/api/users/login", {
      method: "POST", // * Méthode POST pour envoyer les informations.
      headers: {
        "Content-Type": "application/json;charset=utf-8", // * Les données sont envoyées en JSON.
      },
      body: JSON.stringify(id), // * Convertit l'objet utilisateur en JSON.
    })
      .then((response) => response.json()) // * Le serveur renvoie une réponse JSON.
      .then((result) => {
        console.log(result); // TODO: Vérifier la réponse du serveur.

        // ! Si la combinaison e-mail/mot de passe est incorrecte, on affiche un message d'erreur.
        if (result.error || result.message) {
          const p = document.createElement("p");
          p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte";
          loginMdpError.appendChild(p);
        }

        // * Si l'authentification réussit, un token est renvoyé et stocké pour maintenir la session.
        else if (result.token) {
          localStorage.setItem("token", result.token); // * Stocke le token pour maintenir la connexion.
          window.location.href = "index.html"; // * Redirige vers la page d'accueil après connexion.
        }
      })
      .catch((error) => console.log(error)); // ! Gère les erreurs de requête.
  }
}
