let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

function saveTickets() {
    localStorage.setItem("tickets", JSON.stringify(tickets));
}

function loadTickets() {

    const table = document.getElementById("ticketTable");

    table.innerHTML = `
    <tr>
        <th>User</th>
        <th>Subject</th>
        <th>Status</th>
        <th>Action</th>
    </tr>`;

    tickets.forEach((ticket, index) => {

        table.innerHTML += `
        <tr>
            <td>${ticket.user}</td>
            <td>${ticket.subject}</td>
            <td>${ticket.status}</td>
            <td>
                <button onclick="deleteTicket(${index})">🗑 Delete</button>
            </td>
        </tr>`;

    });

}

function addTicket() {

    const user = document.getElementById("ticketUser").value;
    const subject = document.getElementById("ticketSubject").value;
    const status = document.getElementById("ticketStatus").value;

    if(user==="" || subject===""){
        alert("Please fill all fields");
        return;
    }

    tickets.push({
        user:user,
        subject:subject,
        status:status
    });

    saveTickets();
    loadTickets();

    document.getElementById("ticketUser").value="";
    document.getElementById("ticketSubject").value="";
}

function deleteTicket(index){
    tickets.splice(index,1);
    saveTickets();
    loadTickets();
}

loadTickets();