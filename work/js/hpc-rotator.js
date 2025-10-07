document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("rotateButton");
    const resultDiv = document.getElementById("rotationResult");
    const WORKERS_PER_WEEK = 5; // adjust as needed

    async function loadProcessors() {
        // Try loading from localStorage first
        const saved = localStorage.getItem("hpcRotationData");
        if (saved) {
            return JSON.parse(saved);
        }

        // Otherwise load from JSON
        const response = await fetch("processor-list.json");
        const data = await response.json();
        // Initialize workedLastWeek if missing
        return data.processors.map(p => ({ ...p, workedLastWeek: p.workedLastWeek ?? false }));
    }

    function rotateList(list) {
        return [...list.slice(1), list[0]];
    }

    function markWorked(list) {
        // Mark the first N as worked last week
        return list.map((p, i) => ({
            ...p,
            workedLastWeek: i < WORKERS_PER_WEEK
        }));
    }

    function displayList(list) {
        resultDiv.innerHTML = `
            <ol class="processor-list">
                ${list
                    .map(p => 
                        `<li>${p.name} ${p.workedLastWeek ? "<span class='worked'>(worked last week)</span>" : ""}</li>`
                    )
                    .join("")}
            </ol>
        `;
    }

    function saveToLocal(list) {
        localStorage.setItem("hpcRotationData", JSON.stringify(list));
    }

    button.addEventListener("click", async () => {
        let processors = await loadProcessors();
        processors = rotateList(processors);
        processors = markWorked(processors);
        saveToLocal(processors);
        displayList(processors);
    });

    // Display initial list
    loadProcessors().then(displayList);
});