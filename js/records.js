// ==========================================
// EvoAxis V2
// records.js
// ==========================================

// ------------------------------------------
// Elements
// ------------------------------------------

const tableBody = document.getElementById("recordsBody");
const searchInput = document.getElementById("searchInput");
const recordCount = document.getElementById("recordCount");

let allRecords = [];

// ------------------------------------------
// Load Records
// ------------------------------------------

async function loadRecords() {

    try {

        const response = await fetch(API_URL);

        const result = await response.json();

        if (!result.success) {

            alert(result.message);
            return;

        }

        allRecords = result.data;

        recordCount.textContent = allRecords.length;

        renderTable(allRecords);

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ------------------------------------------
// Render Table
// ------------------------------------------

function renderTable(records) {

    tableBody.innerHTML = "";

    if (records.length === 0) {

        tableBody.innerHTML = `

        <tr>

            <td colspan="10" class="no-data">

                No Breakdown Records Found

            </td>

        </tr>

        `;

        return;

    }

    records.forEach(record => {

        tableBody.innerHTML += `

        <tr>

            <td>${record.breakdownID}</td>

            <td>${record.machineID}</td>

            <td>${record.machineName}</td>

            <td>${record.operatorName}</td>

            <td>${record.attendedBy}</td>

            <td>${record.downtime}</td>

            <td>${record.problemNature}</td>

            <td>${record.correctiveAction}</td>

            <td>${record.rootCause}</td>

            <td>${record.timestamp}</td>

        </tr>

        `;

    });

}

// ------------------------------------------
// Search
// ------------------------------------------

searchInput.addEventListener("input", function () {

    const value = this.value.toLowerCase().trim();

    const filtered = allRecords.filter(record =>

        record.breakdownID.toLowerCase().includes(value) ||

        record.machineID.toLowerCase().includes(value) ||

        record.machineName.toLowerCase().includes(value) ||

        record.operatorName.toLowerCase().includes(value) ||

        record.attendedBy.toLowerCase().includes(value) ||

        record.problemNature.toLowerCase().includes(value) ||

        record.rootCause.toLowerCase().includes(value)

    );

    renderTable(filtered);

});

// ------------------------------------------
// Auto Refresh
// ------------------------------------------

setInterval(loadRecords, 5000);

// ------------------------------------------
// Initial Load
// ------------------------------------------

loadRecords();