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
