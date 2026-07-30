import { ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { db } from "./firebase.js";

const providerRef = ref(db, "providers");

function loadProviders() {
    onValue(providerRef, (snapshot) => {

        const table = document.getElementById("providerTable");

        table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>API URL</th>
            <th>API Key</th>
            <th>Status</th>
            <th>Action</th>
        </tr>`;

        snapshot.forEach((child) => {

            const data = child.val();

            table.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.api}</td>
                <td>${data.key}</td>
                <td>${data.status}</td>
                <td>
                    <button onclick="deleteProvider('${child.key}')">
                    Delete
                    </button>
                </td>
            </tr>`;
        });

    });
}

window.addProvider = function () {

    const name = document.getElementById("providerName").value;
    const api = document.getElementById("providerApi").value;
    const key = document.getElementById("providerKey").value;
    const status = document.getElementById("providerStatus").value;

    if (!name || !api || !key) {
        alert("Fill all fields");
        return;
    }

    const newRef = push(providerRef);

    set(newRef, {
        name,
        api,
        key,
        status
    });

    document.getElementById("providerName").value = "";
    document.getElementById("providerApi").value = "";
    document.getElementById("providerKey").value = "";
};

window.deleteProvider = function(id) {

    remove(ref(db, "providers/" + id));

};

loadProviders();