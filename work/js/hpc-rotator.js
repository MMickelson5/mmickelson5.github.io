document.addEventListener("DOMContentLoaded", () => {
    const sheetURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bAefKxiMybjAFIVN9xs2jj40JGCMabnDir46vzpyk46AQiMr_qAfy7DMO-yg1pV5422lZkicv43E/pub?output=csv";
    const rotateButton = document.getElementById("rotateButton");
    const lastWeekDiv = document.getElementById("lastWeekList");
    const thisWeekDiv = document.getElementById("thisWeekList");
    const MAX_THIS_WEEK = 12;

    // Load saved "last week" data if available
    let lastWeekSaved = JSON.parse(localStorage.getItem("lastWeek")) || [];
    if (lastWeekSaved.length > 0) {
    displayList(lastWeekDiv, lastWeekSaved);
    }

    rotateButton.addEventListener("click", async () => {
    try {
        const res = await fetch(sheetURL);
        const csv = await res.text();

        const rows = csv.trim().split("\n").map(r => r.split(","));
        const headers = rows[0].map(h => h.trim());
        const data = rows.slice(1).map(r =>
        Object.fromEntries(r.map((v, i) => [headers[i], v.trim()]))
        );

        // Convert TRUE/FALSE to booleans
        data.forEach(p => {
        p.Permanent = p.Permanent?.toUpperCase() === "TRUE";
        p.LastWeek = p["Last Week"]?.toUpperCase() === "TRUE";
        });

        const permanents = data.filter(p => p.Permanent);
        const pool = data.filter(p => !p.Permanent);
        const picksNeeded = MAX_THIS_WEEK - permanents.length;

        // People who worked last week have slightly lower odds, but not excluded.
        const weightedSorted = pool
        .map(p => {
            const weight = p.LastWeek ? 0.5 : 1;
            return { ...p, score: Math.random() ** (1 / weight) };
        })
        .sort((a, b) => b.score - a.score);

        const selected = weightedSorted.slice(0, picksNeeded);
        const thisWeek = [...permanents, ...selected];

        // Update both lists immediately
        displayList(lastWeekDiv, lastWeekSaved.length ? lastWeekSaved : []);
        displayList(thisWeekDiv, thisWeek);

        // Save for next time
        localStorage.setItem("lastWeek", JSON.stringify(thisWeek));
        lastWeekSaved = thisWeek;
        } catch (err) {
            console.error("Error loading sheet:", err);
        }
    });

    function displayList(container, list) {
    container.innerHTML = "";
    const ul = document.createElement("ul");
    ul.classList.add("processor-list");

    if (!list || list.length === 0) {
        const li = document.createElement("li");
        li.textContent = "(No data)";
        ul.appendChild(li);
    } else {
        list.forEach(person => {
        const li = document.createElement("li");
        li.textContent = person.Name;
        if (person.Permanent) {
            const tag = document.createElement("span");
            tag.textContent = " (Permanent)";
            tag.classList.add("permanent");
            li.appendChild(tag);
        }
        ul.appendChild(li);
        });
    }

    container.appendChild(ul);
    }
});