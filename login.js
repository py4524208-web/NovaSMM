import { app } from "./firebase.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

alert("login.js loaded");

const auth = getAuth(app);

window.login = async function () {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    console.log(userCredential.user);

    alert("✅ Login Successful");

    window.location.href = "./dashboard.html";

  } catch (error) {

    console.error(error);

    alert(
      "Error Code: " + error.code +
      "\n\nMessage: " + error.message
    );

  }

};