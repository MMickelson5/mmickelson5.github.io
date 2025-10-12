document.addEventListener("DOMContentLoaded", () => {
  const sheetURL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bAefKxiMybjAFIVN9xs2jj40JGCMabnDir46vzpyk46AQiMr_qAfy7DMO-yg1pV5422lZkicv43E/pub?output=csv";
  const rotateButton = document.getElementById("rotateButton");
  const lastWeekDiv = document.getElementById("lastWeekList");
  const thisWeekDiv = document.getElementById("thisWeekList");
  const MAX_THIS_WEEK = 12;

  // Load stored rotation (list + date)
  let lastRotation = JSON.parse(localStorage.getItem("lastRotation")) || null;
  if (lastRotation?.list?.length) {
    displayList(lastWeekDiv, lastRotation.list, lastRotation.date);
  }

  rotateButton.addEventListener("click", async () => {
    try {
      // Fetch live data from Google Sheets (read-only CSV)
      const res = await fetch(sheetURL);
      const csv = await res.text();

      const rows = csv.trim().split("\n").map((r) => r.split(","));
      const headers = rows[0].map((h) => h.trim());
      const data = rows.slice(1).map((r) =>
        Object.fromEntries(r.map((v, i) => [headers[i], v.trim()]))
      );

      // Convert "TRUE"/"FALSE" to booleans
      data.forEach((p) => {
        p.Permanent = p.Permanent?.toUpperCase() === "TRUE";
        p.LastWeek = p["Last Week"]?.toUpperCase() === "TRUE";
      });

      const permanents = data.filter((p) => p.Permanent);
      const pool = data.filter((p) => !p.Permanent);
      const picksNeeded = MAX_THIS_WEEK - permanents.length;

      // Weighted random selection (less chance if LastWeek = TRUE)
      const weightedSorted = pool
        .map((p) => {
          const weight = p.LastWeek ? 0.5 : 1;
          return { ...p, score: Math.random() ** (1 / weight) };
        })
        .sort((a, b) => b.score - a.score);

      const selected = weightedSorted.slice(0, picksNeeded);
      const thisWeek = [...permanents, ...selected];

      const today = new Date();
      const dateStamp = today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // Update both lists
      displayList(lastWeekDiv, lastRotation?.list || [], lastRotation?.date);
      displayList(thisWeekDiv, thisWeek, dateStamp);

      // Save locally for next load
      lastRotation = { list: thisWeek, date: dateStamp };
      localStorage.setItem("lastRotation", JSON.stringify(lastRotation));

      // 🔹 Send update to your local Node API (write to Sheet)
      try {
        await fetch("http://localhost:3000/update-rotation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            list: thisWeek,
            date: dateStamp,
          }),
        });
        console.log("✅ Sheet updated successfully");
      } catch (err) {
        console.error("❌ Failed to update sheet:", err);
      }
    } catch (err) {
      console.error("Error loading sheet:", err);
    }
  });

  function displayList(container, list, date) {
    container.innerHTML = "";

    // Date label
    const dateLabel = document.createElement("p");
    dateLabel.classList.add("date-stamp");
    dateLabel.textContent = date ? `Updated: ${date}` : "No recent data";
    container.appendChild(dateLabel);

    const ul = document.createElement("ul");
    ul.classList.add("processor-list");

    if (!list || list.length === 0) {
      const li = document.createElement("li");
      li.textContent = "(No data)";
      ul.appendChild(li);
    } else {
      list.forEach((person) => {
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
