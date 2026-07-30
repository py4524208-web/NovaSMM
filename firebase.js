import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);