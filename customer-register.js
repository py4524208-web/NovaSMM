import {
createUserWithEmailAndPassword,
updateProfile
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
ref,
set
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import { auth, db } from "./firebase.js";

const btn = document.getElementById("registerBtn");

if(btn){

btn.onclick = async ()=>{

const name = document.getElementById("name").value.trim();

const email = document.getElementById("email").value.trim();

const password = document.getElementById("password").value;

const confirm = document.getElementById("confirmPassword").value;

const msg = document.getElementById("msg");

msg.innerHTML="";

if(!name || !email || !password || !confirm){

msg.innerHTML="Please fill all fields.";

return;

}

if(password!==confirm){

msg.innerHTML="Passwords do not match.";

return;

}

try{

const userCredential = await createUserWithEmailAndPassword(auth,email,password);

await updateProfile(userCredential.user,{
displayName:name
});

await set(ref(db,"customers/"+userCredential.user.uid),{

uid:userCredential.user.uid,
name:name,
email:email,
wallet:0,
status:"Active",
createdAt:new Date().toLocaleString()

});

location.href="customer-dashboard.html";

}catch(e){

msg.innerHTML=e.code;

}

};

}

console.log("Customer Register Part 1 Loaded");
// =======================
// SESSION CHECK
// =======================

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{

if(user){

console.log("Customer Logged In :",user.email);

}

});

// =======================
// LOGOUT
// =======================

window.customerLogout = async function(){

try{

await signOut(auth);

location.href="customer-login.html";

}catch(e){

console.log(e);

}

};

// =======================
// ENTER KEY REGISTER
// =======================

document.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

const btn=document.getElementById("registerBtn");

if(btn){

btn.click();

}

}

});

console.log("Customer Register Part 2 Loaded");