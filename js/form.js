// ==========================================
// EvoAxis V2
// form.js
// ==========================================

// -----------------------------
// Get Machine Details from URL
// -----------------------------

const params = new URLSearchParams(window.location.search);

document.getElementById("machineID").value =
params.get("id") || "";

document.getElementById("machineName").value =
params.get("name") || "";

// -----------------------------
// Get Form Elements
// -----------------------------

const startDate = document.getElementById("startDate");
const startTime = document.getElementById("startTime");

const endDate = document.getElementById("endDate");
const endTime = document.getElementById("endTime");

const downtime = document.getElementById("downtime");

// -----------------------------
// Calculate Downtime
// -----------------------------

function calculateDowntime() {

    if (
        !startDate.value ||
        !startTime.value ||
        !endDate.value ||
        !endTime.value
    ) {

        downtime.value = "";
        return;

    }

    const start = new Date(
        startDate.value + "T" + startTime.value
    );

    const end = new Date(
        endDate.value + "T" + endTime.value
    );

    if (end < start) {

        downtime.value = "Invalid Date/Time";
        return;

    }

    let diff = end - start;

    let totalMinutes = Math.floor(diff / 60000);

    const days = Math.floor(totalMinutes / (60 * 24));

    totalMinutes %= (60 * 24);

    const hours = Math.floor(totalMinutes / 60);

    const minutes = totalMinutes % 60;

    let result = "";

    if (days > 0)
        result += `${days} Day${days > 1 ? "s" : ""} `;

    if (hours > 0)
        result += `${hours} Hour${hours > 1 ? "s" : ""} `;

    if (minutes > 0)
        result += `${minutes} Minute${minutes > 1 ? "s" : ""}`;

    if (result === "")
        result = "0 Minutes";

    downtime.value = result.trim();

}

// -----------------------------
// Event Listeners
// -----------------------------

startDate.addEventListener("change", calculateDowntime);
startTime.addEventListener("change", calculateDowntime);
endDate.addEventListener("change", calculateDowntime);
endTime.addEventListener("change", calculateDowntime);

// -----------------------------
// Submit Form
// -----------------------------

document
.getElementById("breakdownForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const submitBtn = document.querySelector(
        '#breakdownForm button[type="submit"]'
    );

    submitBtn.disabled = true;
    submitBtn.innerHTML = "⏳ Saving... Please Wait...";

    const breakdown = {

        machineID: document.getElementById("machineID").value,

        machineName: document.getElementById("machineName").value,

        operatorName: document.getElementById("operatorName").value,

        attendedBy: document.getElementById("attendedBy").value,

        startDate: document.getElementById("startDate").value,

        startTime: document.getElementById("startTime").value,

        endDate: document.getElementById("endDate").value,

        endTime: document.getElementById("endTime").value,

        downtime: document.getElementById("downtime").value,

        problemNature: document.getElementById("problemNature").value,

        correctiveAction: document.getElementById("correctiveAction").value,

        spareUsed: document.getElementById("spareUsed").value,

        rootCause: document.getElementById("rootCause").value

    };

    try {

        const formData = new URLSearchParams();

        for (const key in breakdown) {

            formData.append(key, breakdown[key]);

        }

        const response = await fetch(API_URL, {

            method: "POST",

            body: formData

        });

        const result = await response.json();

        if (result.success) {

            submitBtn.innerHTML = "✅ Saved Successfully";

            setTimeout(() => {

                window.location.href = "records.html";

            }, 800);

        }

        else {

            alert(result.message);

            submitBtn.disabled = false;
            submitBtn.innerHTML = "Submit Breakdown";

        }

    }

    catch (error) {

        console.error(error);

        alert("❌ Unable to connect to EvoAxis Server.");

        submitBtn.disabled = false;
        submitBtn.innerHTML = "Submit Breakdown";

    }

});