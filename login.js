import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { auth } from "./firebase.js";

const currentPage = window.location.pathname.split("/").pop();

// =======================
// LOGIN PAGE
// =======================

if (currentPage === "index.html" || currentPage === "" || currentPage === "login.html") {

  const loginBtn = document.getElementById("loginBtn");

  if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const msg = document.getElementById("msg");

      msg.innerHTML = "";

      if (!email || !password) {
        msg.innerHTML = "Please enter email and password.";
        return;
      }

      try {

        await signInWithEmailAndPassword(auth, email, password);

        location.href = "dashboard.html";

      } catch (e) {

        console.error(e);

        msg.innerHTML = e.code;

      }

    });

  }

}

// =======================
// PROTECT ADMIN PAGES
// =======================

if (
currentPage !== "index.html" &&
currentPage !== "" &&
currentPage !== "login.html"
) {

  onAuthStateChanged(auth, (user) => {

    if (!user) {

      location.href = "index.html";

    }

  });

}

// =======================
// LOGOUT
// =======================

window.logout = async function () {

  await signOut(auth);

  location.href = "index.html";

};

console.log("NovaSMM Login Ready");