//! ================================ LÉGENDE ================================
//! * Important : Informations importantes
//! ! Critique : Erreurs ou points à corriger immédiatement
//! ? Question : À clarifier ou vérifier
//! // TODO : À faire plus tard
//! ========================================================================
//! -------------------------------------------------------------- VARIABLES GLOBALES ----------------------------------------------------------------------

// * Sélection des éléments d'affichage des erreurs
const alredyLoggedError = document.querySelector(".alredyLogged__error"); // * Erreur : utilisateur déjà connecté
const loginEmailError = document.querySelector(".loginEmail__error"); // * Erreur : email incorrect
const loginMdpError = document.querySelector(".loginMdp__error"); // * Erreur : mot de passe incorrect

// * Sélection des champs email et mot de passe
const email = document.getElementById("email"); // * Champ email
const password = document.getElementById("password"); // * Champ mot de passe
// * Sélection du bouton de soumission
const submit = document.getElementById("submit"); // * Bouton de soumission
alredyLogged(); // * Vérifie si l'utilisateur est déjà connecté

function alredyLogged() {
  if (localStorage.getItem("token")) {
    // ! Token présent, utilisateur déjà connecté
    localStorage.removeItem("token"); // ! Suppression du token, déconnexion de l'utilisateur

    const p = document.createElement("p"); // * Création d'un message de déconnexion
    p.innerHTML =
      "<br><br><br>Vous avez été déconnecté, veuillez vous reconnecter";
    alredyLoggedError.appendChild(p); // * Affichage du message
    return;
  }
}
submit.addEventListener("click", () => {
  let user = {
    email: email.value, // * Récupération de l'email
    password: password.value, // * Récupération du mot de passe
  };
  login(user); // * Tentative de connexion
});
