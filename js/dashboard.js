// ==========================================
// EvoAxis V2
// dashboard.js
// ==========================================

// Dashboard Elements

const totalBreakdowns = document.getElementById("totalBreakdowns");
const totalDowntime = document.getElementById("totalDowntime");
const mttr = document.getElementById("mttr");
const rankingDiv = document.getElementById("machineRanking");

let chart = null;

// ==========================================
// Convert Downtime String to Minutes
// ==========================================

function downtimeToMinutes(text) {

    if (!text) return 0;

    let minutes = 0;

    const day = text.match(/(\d+)\s*Day/i);
    const hour = text.match(/(\d+)\s*Hour/i);
    const minute = text.match(/(\d+)\s*Minute/i);

    if (day) minutes += parseInt(day[1]) * 24 * 60;
    if (hour) minutes += parseInt(hour[1]) * 60;
    if (minute) minutes += parseInt(minute[1]);

    return minutes;

}

// ==========================================
// Convert Minutes to Readable Text
// ==========================================

function formatMinutes(totalMinutes) {

    if (totalMinutes <= 0)
        return "0 Min";

    const days = Math.floor(totalMinutes / 1440);

    totalMinutes %= 1440;

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    let text = "";

    if (days > 0)
        text += days + " Day ";

    if (hours > 0)
        text += hours + " Hr ";

    if (minutes > 0)
        text += minutes + " Min";

    return text.trim();

}

// ==========================================
// Load Dashboard
// ==========================================

async function loadDashboard() {

    try {

        const response = await fetch(API_URL);

        const result = await response.json();

        if (!result.success) {

            alert(result.message);
            return;

        }

        const records = result.data;

        // -----------------------------
        // Total Breakdowns
        // -----------------------------

        totalBreakdowns.textContent = records.length;

        // -----------------------------
        // Total Downtime
        // -----------------------------

        let totalMinutes = 0;

        records.forEach(record => {

            totalMinutes += downtimeToMinutes(record.downtime);

        });

        totalDowntime.textContent =
            formatMinutes(totalMinutes);

        // -----------------------------
        // MTTR
        // -----------------------------

        if (records.length > 0) {

            mttr.textContent =
                formatMinutes(

                    Math.round(totalMinutes / records.length)

                );

        } else {

            mttr.textContent = "0 Min";

        }

        

        

        // -----------------------------
        // Machine Ranking
        // -----------------------------

        const machineCounts = {};

        records.forEach(record => {

            const machine = record.machineName;

            if (machineCounts[machine]) {

                machineCounts[machine]++;

            } else {

                machineCounts[machine] = 1;

            }

        });

        const ranking = Object.entries(machineCounts)

            .sort((a, b) => b[1] - a[1]);

        rankingDiv.innerHTML = "";

        if (ranking.length === 0) {

            rankingDiv.innerHTML = `

            <div class="no-data">

                No Breakdown Records Available

            </div>

            `;

        } else {

            ranking.forEach((item, index) => {

                let medal = "🏅";

                if (index === 0) medal = "🥇";
                else if (index === 1) medal = "🥈";
                else if (index === 2) medal = "🥉";

                rankingDiv.innerHTML += `

                <div class="rank-item">

                    <div class="rank-machine">

                        ${medal} ${item[0]}

                    </div>

                    <div class="rank-count">

                        ${item[1]}

                    </div>

                </div>

                `;

            });

        }

        // -----------------------------
        // Doughnut Chart
        // -----------------------------

        const labels = ranking.map(item => item[0]);

        const values = ranking.map(item => item[1]);

        if (chart) {

            chart.destroy();

        }

        const ctx = document
            .getElementById("breakdownChart")
            .getContext("2d");

        chart = new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: labels,

                datasets: [{

                    data: values,

                    borderWidth: 2,

                    hoverOffset: 12

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                },

                cutout: "70%"

            }

        });

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ==========================================
// Start Dashboard
// ==========================================

window.addEventListener("focus", () => {

    loadDashboard();

});

document.addEventListener("visibilitychange", () => {

    if (!document.hidden) {

        loadDashboard();

    }

});

loadDashboard();