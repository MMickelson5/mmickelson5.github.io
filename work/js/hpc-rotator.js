document.addEventListener("DOMContentLoaded", () => {
    const rotateButton = document.getElementById("rotateButton");
    const lastWeekDiv = document.getElementById("lastWeekList");
    const thisWeekDiv = document.getElementById("thisWeekList");
    const WORKERS_PER_WEEK = 5;

    // --- Load from storage or JSON ---
    async function loadProcessors() {
        const saved = localStorage.getItem("hpcRotationData");
        if (saved) {
            const parsed = JSON.parse(saved);
            // If it's an array (old format), wrap it
            if (Array.isArray(parsed)) {
                return {
                    timestamp: new Date().toISOString(),
                    processors: parsed
                };
            }
            // Otherwise return as-is (new format)
            return parsed;
        }

        const response = await fetch("processor-list.json");
        const data = await response.json();
        return {
            timestamp: new Date().toISOString(),
            processors: data.processors.map(p => ({
                ...p,
                workedLastWeek: p.workedLastWeek ?? false,
                permanent: p.permanent ?? false
            }))
        };
    }

    function rotateList(list) {
        const permanents = list.filter(p => p.permanent);
        const rotatable = list.filter(p => !p.permanent);
        const rotated = [...rotatable.slice(1), rotatable[0]];
        return [...permanents, ...rotated];
    }

    function markWorked(list) {
        const permanents = list.filter(p => p.permanent);
        const rotatable = list.filter(p => !p.permanent);

        const updatedRotatable = rotatable.map((p, i) => ({
            ...p,
            workedLastWeek: i < WORKERS_PER_WEEK
        }));

        const updatedPermanents = permanents.map(p => ({
            ...p,
            workedLastWeek: true
        }));

        return [...updatedPermanents, ...updatedRotatable];
    }

    function displayList(container, data, title) {
        if (!data || !data.processors) {
            container.innerHTML = "<p style='color:red;'>Error loading data.</p>";
            return;
        }

        const date = new Date(data.timestamp).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        container.innerHTML = `
            <h3>${title} (${date})</h3>
            <ol class="processor-list">
                ${data.processors
                    .map(p => `
                        <li>
                            ${p.name}
                            ${p.permanent ? "<span class='permanent'>(permanent)</span>" : ""}
                            ${!p.permanent && p.workedLastWeek ? "<span class='worked'>(worked last week)</span>" : ""}
                        </li>
                    `)
                    .join("")}
            </ol>
        `;
    }

    function saveToLocal(data) {
        localStorage.setItem("hpcRotationData", JSON.stringify(data));
    }

    function exportPreviousWeek(data) {
        const blob = new Blob([JSON.stringify(data, null, 4)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "previous-week.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // --- On load: show last week ---
    loadProcessors().then(data => {
        displayList(lastWeekDiv, data, "Last Week’s List");
    });

    rotateButton.addEventListener("click", async () => {
        const lastWeekData = await loadProcessors();
        displayList(lastWeekDiv, lastWeekData, "Last Week’s List");

        exportPreviousWeek(lastWeekData);

        let newProcessors = rotateList(lastWeekData.processors);
        newProcessors = markWorked(newProcessors);

        const newData = {
            timestamp: new Date().toISOString(),
            processors: newProcessors
        };

        saveToLocal(newData);
        displayList(thisWeekDiv, newData, "This Week’s List");
    });
});