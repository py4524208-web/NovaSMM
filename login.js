import { app } from "./firebase.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const auth = getAuth(app);

async function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {

    await signInWithEmailAndPassword(auth, email, password);

    alert("Login Successful");

    window.location.href = "dashboard.html";

  } catch (e) {

    alert(e.code + "\n" + e.message);
    console.log(e);

  }

}

window.login = login;

// Login button connect
document.getElementById("loginBtn").addEventListener("click", login);