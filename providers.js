let providers = JSON.parse(localStorage.getItem("providers")) || [];

function saveProviders() {
    localStorage.setItem("providers", JSON.stringify(providers));
}

function loadProviders() {
    const table = document.getElementById("providerTable");

    table.innerHTML = `
    <tr>
        <th>Provider</th>
        <th>API URL</th>
        <th>Action</th>
    </tr>`;

    providers.forEach((item, index) => {
        table.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.api}</td>
            <td>
                <button onclick="deleteProvider(${index})">🗑 Delete</button>
            </td>
        </tr>`;
    });
}

function addProvider() {
    const name = document.getElementById("providerName").value;
    const api = document.getElementById("providerApi").value;

    if (name === "" || api === "") {
        alert("Fill all fields");
        return;
    }

    providers.push({
        name: name,
        api: api
    });

    saveProviders();
    loadProviders();

    document.getElementById("providerName").value = "";
    document.getElementById("providerApi").value = "";
}

function deleteProvider(index) {
    providers.splice(index, 1);
    saveProviders();
    loadProviders();
}

loadProviders();