document.addEventListener("DOMContentLoaded", () => {
    const rotateButton = document.getElementById("rotateButton");
    const lastWeekDiv = document.getElementById("lastWeekList");
    const thisWeekDiv = document.getElementById("thisWeekList");
    const MAX_THIS_WEEK = 12; // total people including permanents

    // --- Load processors from localStorage or JSON ---
    async function loadProcessors() {
        const saved = localStorage.getItem("hpcRotationData");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return {
                    timestamp: new Date().toISOString(),
                    processors: parsed
                };
            }
            return parsed;
        }

        const response = await fetch("assets/processor-list.json");
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

    // --- Utility: Shuffle an array (Fisher–Yates algorithm) ---
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

   function createNewRotation(list) {
        const permanents = list.filter(p => p.permanent);
        const nonPermanents = list.filter(p => !p.permanent);

        // Exclude people who worked last week
        const eligible = nonPermanents.filter(p => !p.workedLastWeek);

        // Weight selection — those who prefer HPC get higher odds
        const weightedPool = eligible.flatMap(p => {
            const weight = p.preference ? 5 : 1; // 3x chance if they prefer HPC
            return Array(weight).fill(p);
        });

        // Shuffle the weighted pool
        const shuffled = shuffleArray(weightedPool);

        // Deduplicate after shuffle (so no one appears twice)
        const uniqueShuffled = [];
        const seen = new Set();
        for (const person of shuffled) {
            if (!seen.has(person.name)) {
                uniqueShuffled.push(person);
                seen.add(person.name);
            }
        }

        // Fill remaining slots
        const spotsLeft = MAX_THIS_WEEK - permanents.length;
        const selected = uniqueShuffled.slice(0, spotsLeft);

        // Update the workedLastWeek flags
        const updatedList = list.map(p => {
            if (p.permanent) {
                return { ...p, workedLastWeek: true };
            } else if (selected.some(s => s.name === p.name)) {
                return { ...p, workedLastWeek: true };
            } else {
                return { ...p, workedLastWeek: false };
            }
        });

        // Combine permanents + selected for display
        const displayList = [...permanents, ...selected];

        return {
            timestamp: new Date().toISOString(),
            processors: updatedList,
            displayed: displayList
        };
    }
    // --- Display helper ---
    function displayList(container, data, title, useDisplayed = false) {
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

        const listToShow = useDisplayed ? data.displayed : data.processors.filter(p => p.workedLastWeek);

        container.innerHTML = `
            <h3>${title} (${date})</h3>
            <ol class="processor-list">
                ${listToShow
                    .map(p => `
                        <li>
                            ${p.name}
                            ${p.permanent ? "<span class='permanent'>(permanent)</span>" : ""}
                        </li>
                    `)
                    .join("")}
            </ol>
        `;
    }

    function saveToLocal(data) {
        localStorage.setItem("hpcRotationData", JSON.stringify(data));
    }

    // --- On load ---
    loadProcessors().then(data => {
        displayList(lastWeekDiv, data, "Last Week’s List");
    });

    // --- On Rotate ---
    rotateButton.addEventListener("click", async () => {
        const lastWeekData = await loadProcessors();
        displayList(lastWeekDiv, lastWeekData, "Last Week’s List");

        // Create new random rotation excluding last week’s workers
        const newData = createNewRotation(lastWeekData.processors);

        saveToLocal(newData);
        displayList(thisWeekDiv, newData, "This Week’s List", true);
    });
});