window.onload = function () {

document.getElementById("panelName").value =
localStorage.getItem("panelName") || "NovaSMM";

document.getElementById("currency").value =
localStorage.getItem("currency") || "INR ₹";

};

function saveSettings(){

localStorage.setItem(
"panelName",
document.getElementById("panelName").value
);

localStorage.setItem(
"currency",
document.getElementById("currency").value
);

alert("Settings Saved Successfully!");

}