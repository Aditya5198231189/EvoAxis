// ===============================
// EvoAxis V2
// app.js
// ===============================

const machineGrid = document.getElementById("machineGrid");
const searchInput = document.getElementById("searchInput");
const machineCount = document.getElementById("machineCount");

// =====================================
// Download Excel
// =====================================

const downloadButton = document.getElementById("downloadExcel");

if(downloadButton){

    downloadButton.addEventListener("click",()=>{

        window.open(

            `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=xlsx`,

            "_blank"

        );

    });

}

// =====================================
// Total Machines
// =====================================

machineCount.textContent = machines.length;

// =====================================
// Render Machines
// =====================================

function renderMachines(machineList){

    machineGrid.innerHTML="";

    if(machineList.length===0){

        machineGrid.innerHTML=`

        <div class="no-machine">

            <h3>No Machine Found</h3>

            <p>Try another machine name.</p>

        </div>

        `;

        return;

    }

    machineList.forEach(machine=>{

        const card=document.createElement("div");

        card.className="machine-card";

        card.innerHTML=`

            <div class="machine-id">

                ${machine.id}

            </div>

            <div class="machine-name">

                ${machine.name}

            </div>

        `;

        card.addEventListener("click",()=>{

            window.location.href=

            `form.html?id=${encodeURIComponent(machine.id)}&name=${encodeURIComponent(machine.name)}`;

        });

        machineGrid.appendChild(card);

    });

}

// =====================================
// Initial Load
// =====================================

renderMachines(machines);

// =====================================
// Search
// =====================================

searchInput.addEventListener("input",function(){

    const value=this.value.toLowerCase().trim();

    const filtered=machines.filter(machine=>

        machine.id.toLowerCase().includes(value)||

        machine.name.toLowerCase().includes(value)

    );

    renderMachines(filtered);

});