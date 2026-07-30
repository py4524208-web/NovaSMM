import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { firebaseConfig } from "./firebase.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const page = location.pathname.split("/").pop();

// Login page
if (page === "login.html" || page === "index.html") {

  onAuthStateChanged(auth, (user) => {
    if (user) {
      location.href = "dashboard.html";
    }
  });

  const btn = document.getElementById("loginBtn");

  if (btn) {
    btn.addEventListener("click", async () => {

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const msg = document.getElementById("msg");

      msg.innerHTML = "";

      try {
        await signInWithEmailAndPassword(auth, email, password);
        location.href = "dashboard.html";
      } catch (e) {
        msg.innerHTML = e.message;
      }

    });
  }

}

// Protect Admin Pages
else {

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      location.href = "login.html";
    }
  });

}

// Logout
window.logout = async function () {
  await signOut(auth);
  location.href = "login.html";
};

console.log("✅ Login Security Active");