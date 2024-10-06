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
// * Réinitialisation des messages d'erreur
loginEmailError.innerHTML = "";
loginMdpError.innerHTML = "";
// * Vérification de l'email avec une regex
if (!id.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\\.[a-z]{2,4}$/g)) {
  const p = document.createElement("p"); // ! Erreur : email invalide
  p.innerHTML = "Veuillez entrer une adresse mail valide";
  loginEmailError.appendChild(p);
  return;
}
// * Vérification du mot de passe (au moins 5 caractères, lettres et chiffres uniquement)
if (id.password.length < 5 && !id.password.match(/^[a-zA-Z0-9]+$/g)) {
  const p = document.createElement("p"); // ! Erreur : mot de passe invalide
  p.innerHTML = "Veuillez entrer un mot de passe valide";
  loginMdpError.appendChild(p);
  return;
}
fetch("http://localhost:5678/api/users/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  body: JSON.stringify(id),
})
  .then((response) => response.json())
  .then((result) => {
    console.log(result); // * Résultat de la requête

    if (result.error || result.message) {
      // ! Erreur : combinaison email/mot de passe incorrecte
      const p = document.createElement("p");
      p.innerHTML = "La combinaison e-mail/mot de passe est incorrecte";
      loginMdpError.appendChild(p);
    } else if (result.token) {
      // * Connexion réussie, stockage du token
      localStorage.setItem("token", result.token);
      window.location.href = "index.html"; // * Redirection vers la page d'accueil
    }
  })
  .catch((error) => console.log(error)); // ! Erreur réseau ou serveur
