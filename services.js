import { db } from "./firebase.js";

import {
  ref,
  push,
  set,
  onValue,
  remove,
  update
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

let services = [];

// Add Service
window.addService = function () {

  const name = document.getElementById("serviceName").value.trim();
  const price = document.getElementById("servicePrice").value.trim();
  const category = document.getElementById("serviceCategory").value;
  const provider = document.getElementById("providerId").value.trim();

  if (!name || !price || !provider) {
    alert("Please fill all fields");
    return;
  }

  const newRef = push(ref(db, "services"));

  set(newRef, {
    name,
    price,
    category,
    provider,
    status: "Active"
  });

  document.getElementById("serviceName").value = "";
  document.getElementById("servicePrice").value = "";
  document.getElementById("providerId").value = "";

};

// Render Services
function renderServices() {

  const tbody = document.querySelector("#serviceTable tbody");
  tbody.innerHTML = "";

  services.forEach((service, index) => {

    tbody.innerHTML += `
    <tr>
      <td>${index + 1}</td>
      <td>${service.name}</td>
      <td>${service.category}</td>
      <td>₹${service.price}</td>
      <td>${service.provider}</td>
      <td>
        <button onclick="toggleStatus('${service.id}','${service.status}')">
          ${service.status}
        </button>
      </td>
      <td>
        <button onclick="editService('${service.id}')">✏️</button>
        <button onclick="deleteService('${service.id}')">🗑</button>
      </td>
    </tr>
    `;

  });

}

// Firebase Load
onValue(ref(db, "services"), (snapshot) => {

  services = [];

  snapshot.forEach((child) => {

    services.push({
      id: child.key,
      ...child.val()
    });

  });

  renderServices();

});

// Delete
window.deleteService = function (id) {

  if (confirm("Delete this service?")) {
    remove(ref(db, "services/" + id));
  }

};

// Edit
window.editService = function (id) {

  const service = services.find(x => x.id === id);

  const name = prompt("Service Name", service.name);
  if (!name) return;

  const price = prompt("Price", service.price);
  if (!price) return;

  update(ref(db, "services/" + id), {
    name,
    price
  });

};

// Status
window.toggleStatus = function (id, status) {

  update(ref(db, "services/" + id), {
    status: status === "Active" ? "Inactive" : "Active"
  });

};

// Search
window.searchService = function () {

  const keyword = document.getElementById("searchService").value.toLowerCase();

  document.querySelectorAll("#serviceTable tbody tr").forEach(row => {

    row.style.display =
      row.innerText.toLowerCase().includes(keyword)
        ? ""
        : "none";

  });

};