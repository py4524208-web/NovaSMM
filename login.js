import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import { firebaseConfig } from "./firebase.js";

// =======================
// FIREBASE INIT
// =======================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// =======================
// CHECK LOGIN
// =======================

onAuthStateChanged(auth, (user) => {

if (user) {

window.location.href = "dashboard.html";

}

});

// =======================
// LOGIN
// =======================

window.login = function () {

const email = document.getElementById("email").value.trim();

const password = document.getElementById("password").value;

const remember = document.getElementById("remember").checked;

const error = document.getElementById("loginError");

error.innerText = "";

if (!email || !password) {

error.innerText = "Please enter email and password.";

return;

}

signInWithEmailAndPassword(auth, email, password)

.then((userCredential) => {

const user = userCredential.user;

if (remember) {

localStorage.setItem("rememberLogin", "true");

}

sessionStorage.setItem("adminLogin", "true");

window.location.href = "dashboard.html";

})

.catch((err) => {

error.innerText = err.message;

});

};
// =======================
// LOGOUT
// =======================

window.logout = async function () {

try {

await auth.signOut();

localStorage.removeItem("rememberLogin");
sessionStorage.removeItem("adminLogin");

window.location.href = "login.html";

} catch (e) {

alert("Logout Failed");

}

};

// =======================
// PROTECT ADMIN PAGES
// =======================

const currentPage = window.location.pathname.split("/").pop();

const publicPages = [
"login.html",
"index.html"
];

if (!publicPages.includes(currentPage)) {

onAuthStateChanged(auth, (user) => {

if (!user) {

window.location.href = "login.html";

}

});

}

// =======================
// SESSION CHECK
// =======================

if (
!localStorage.getItem("rememberLogin") &&
!sessionStorage.getItem("adminLogin")
) {

if (!publicPages.includes(currentPage)) {

window.location.href = "login.html";

}

}

// =======================
// ENTER KEY LOGIN
// =======================

document.addEventListener("keydown", function(e){

if(e.key==="Enter"){

const btn=document.querySelector("button");

if(btn){

btn.click();

}

}

});

// =======================
// CONSOLE
// =======================

console.log("✅ NovaSMM Login Security Loaded");