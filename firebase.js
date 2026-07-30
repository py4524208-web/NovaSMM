import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyACKYxVzoamyXcczkrkRHV-lQ26DSInHgs",
  authDomain: "nowasmm.firebaseapp.com",
  databaseURL: "https://nowasmm-default-rtdb.firebaseio.com",
  projectId: "nowasmm",
  storageBucket: "nowasmm.firebasestorage.app",
  messagingSenderId: "103011223164",
  appId: "1:103011223164:web:80ed5d53abd26ca5026bf9",
  measurementId: "G-0JTHRZMQSX"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const auth = getAuth(app);

export { app, db, auth };