// document.addEventListener("DOMContentLoaded", () => {
//     const rotateButton = document.getElementById("rotateButton");
//     const lastWeekDiv = document.getElementById("lastWeekList");
//     const thisWeekDiv = document.getElementById("thisWeekList");
//     const MAX_THIS_WEEK = 12; // total people including permanents

//     // --- Load processors from localStorage or JSON ---
//     async function loadProcessors() {
//         const saved = localStorage.getItem("hpcRotationData");
//         if (saved) {
//             const parsed = JSON.parse(saved);
//             if (Array.isArray(parsed)) {
//                 return {
//                     timestamp: new Date().toISOString(),
//                     processors: parsed
//                 };
//             }
//             return parsed;
//         }

//         const response = await fetch("assets/processor-list.json");
//         const data = await response.json();
//         return {
//             timestamp: new Date().toISOString(),
//             processors: data.processors.map(p => ({
//                 ...p,
//                 workedLastWeek: p.workedLastWeek ?? false,
//                 permanent: p.permanent ?? false
//             }))
//         };
//     }

//     // --- Utility: Shuffle an array (Fisher–Yates algorithm) ---
//     function shuffleArray(array) {
//         const arr = [...array];
//         for (let i = arr.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [arr[i], arr[j]] = [arr[j], arr[i]];
//         }
//         return arr;
//     }

//     // --- Core rotation logic ---
//     function createNewRotation(list) {
//         const permanents = list.filter(p => p.permanent);
//         const nonPermanents = list.filter(p => !p.permanent);

//         // Exclude people who worked last week
//         const eligible = nonPermanents.filter(p => !p.workedLastWeek);

//         // Shuffle and pick remaining slots to fill up to MAX_THIS_WEEK
//         const shuffled = shuffleArray(eligible);
//         const spotsLeft = MAX_THIS_WEEK - permanents.length;
//         const selected = shuffled.slice(0, spotsLeft);

//         // Mark everyone’s new workedLastWeek state
//         const updatedList = list.map(p => {
//             if (p.permanent) {
//                 return { ...p, workedLastWeek: true };
//             } else if (selected.some(s => s.name === p.name)) {
//                 return { ...p, workedLastWeek: true };
//             } else {
//                 return { ...p, workedLastWeek: false };
//             }
//         });

//         // Combine and display only the selected 12 (permanents + selected)
//         const displayList = [...permanents, ...selected];

//         return {
//             timestamp: new Date().toISOString(),
//             processors: updatedList,
//             displayed: displayList
//         };
//     }

//     // --- Display helper ---
//     function displayList(container, data, title, useDisplayed = false) {
//         if (!data || !data.processors) {
//             container.innerHTML = "<p style='color:red;'>Error loading data.</p>";
//             return;
//         }

//         const date = new Date(data.timestamp).toLocaleDateString(undefined, {
//             weekday: "short",
//             month: "short",
//             day: "numeric",
//             year: "numeric"
//         });

//         const listToShow = useDisplayed ? data.displayed : data.processors.filter(p => p.workedLastWeek);

//         container.innerHTML = `
//             <h3>${title} (${date})</h3>
//             <ol class="processor-list">
//                 ${listToShow
//                     .map(p => `
//                         <li>
//                             ${p.name}
//                             ${p.permanent ? "<span class='permanent'>(permanent)</span>" : ""}
//                         </li>
//                     `)
//                     .join("")}
//             </ol>
//         `;
//     }

//     function saveToLocal(data) {
//         localStorage.setItem("hpcRotationData", JSON.stringify(data));
//     }

//     // --- On load ---
//     loadProcessors().then(data => {
//         displayList(lastWeekDiv, data, "Last Week’s List");
//     });

//     // --- On Rotate ---
//     rotateButton.addEventListener("click", async () => {
//         const lastWeekData = await loadProcessors();
//         displayList(lastWeekDiv, lastWeekData, "Last Week’s List");

//         // Create new random rotation excluding last week’s workers
//         const newData = createNewRotation(lastWeekData.processors);

//         saveToLocal(newData);
//         displayList(thisWeekDiv, newData, "This Week’s List", true);
//     });
// });

///////////////////////////////////////////////////////////////////////////////
// Revised version to fetch from Google Sheets CSV and simplify logic
///////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    const rotateButton = document.getElementById("rotateButton");
    const lastWeekDiv = document.getElementById("lastWeekList");
    const thisWeekDiv = document.getElementById("thisWeekList");
    
    // Total people to be in "This Week's List"
    const MAX_ROTATION_SIZE = 12;

    // Direct link to the public CSV export of your Google Sheet (Sheet 1/gid=0)
    // NOTE: Ensure your Google Sheet is published to the web for this link to work.
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ6bAefKxiMybjAFIVN9xs2jj40JGCMabnDir46vzpyk46AQiMr_qAfy7DMO-yg1pV5422lZkicv43E/pub?output=csv';

    // --- Utility: Shuffle an array (Fisher–Yates algorithm) ---
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
        return arr;
    }

    // --- Data Fetching and Parsing ---
    async function fetchAndParseSheet(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch Google Sheet CSV.');
            
            const csvText = await response.text();
            
            // Split into rows, skip the header row, and clean up empty lines
            const rows = csvText.trim().split('\n').slice(1).filter(row => row.trim() !== '');

            // Convert each CSV row into a processor object
            const processors = rows.map(row => {
                // Assumes columns: Name, Permanent, Last Week (but only uses Name and Permanent)
                const columns = row.split(',').map(s => s.trim().replace(/"/g, ''));
                const name = columns[0];
                // Check if 'Permanent' column is 'Y' or 'TRUE' (case-insensitive)
                const permanent = columns[1] && (columns[1].toUpperCase() === 'Y' || columns[1].toUpperCase() === 'TRUE');
                
                return { name, permanent };
            }).filter(p => p.name); // Filter out any rows with empty names
            
            return {
                timestamp: new Date().toISOString(),
                processors: processors
            };
        } catch (error) {
            console.error("Error loading processor list:", error);
            return { timestamp: new Date().toISOString(), processors: [] };
        }
    }

    // --- Rotation Logic (Simplified: No exclusion) ---
    function createNewRotation(allProcessors) {
        // 1. Separate permanent and non-permanent
        const permanentProcessors = allProcessors.processors.filter(p => p.permanent);
        const nonPermanentProcessors = allProcessors.processors.filter(p => !p.permanent);

        // 2. Determine how many more non-permanent people are needed
        const spotsNeeded = MAX_ROTATION_SIZE - permanentProcessors.length;

        if (spotsNeeded <= 0) {
            // If permanent spots fill the list, just return them
            return {
                timestamp: new Date().toISOString(),
                displayed: permanentProcessors
            };
        }

        // 3. Shuffle ALL non-permanent processors (NO exclusion for 'workedLastWeek')
        const shuffledNonPermanent = shuffleArray(nonPermanentProcessors);

        // 4. Select the needed number and combine with permanents
        const selectedNonPermanent = shuffledNonPermanent.slice(0, spotsNeeded);

        const newRotationList = [...permanentProcessors, ...selectedNonPermanent];

        return {
            timestamp: new Date().toISOString(),
            displayed: newRotationList
        };
    }

    // --- Display and Save Functions ---

    function displayList(container, data, title) {
        if (!data || data.displayed.length === 0) {
            container.innerHTML = `<p>No list available for ${title}.</p>`;
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
                ${data.displayed
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

    function getSavedRotation() {
        const saved = localStorage.getItem("hpcRotationData");
        return saved ? JSON.parse(saved) : null;
    }
    
    function saveRotation(data) {
        localStorage.setItem("hpcRotationData", JSON.stringify(data));
    }

    // --- On load: Display the *last completed* rotation ---
    let lastRotationData = getSavedRotation();
    if (lastRotationData) {
        displayList(lastWeekDiv, lastRotationData, "Last Week’s List");
    } else {
        lastWeekDiv.innerHTML = `<p>No rotation data saved yet. Click Rotate to start the first week.</p>`;
    }


    // --- On Rotate Button Click ---
    rotateButton.addEventListener("click", async () => {
        // Step 1: **BEFORE** creating the new one, move the current saved list to "Last Week"
        // The list we are about to overwrite is the current "This Week's List" (which is saved as the last rotation)
        const currentSavedData = getSavedRotation();
        if (currentSavedData) {
            displayList(lastWeekDiv, currentSavedData, "Last Week’s List");
            lastRotationData = currentSavedData; // Update the variable for reference
        }

        // Clear the "This Week" list temporarily
        thisWeekDiv.innerHTML = '<p>Generating new list...</p>';
        
        // Step 2: Fetch the master list from the Google Sheet
        const allProcessors = await fetchAndParseSheet(CSV_URL);

        // Step 3: Create the new rotation list
        const newRotation = createNewRotation(allProcessors);

        // Step 4: Save the new list to local storage
        saveRotation(newRotation);

        // Step 5: Display the new list
        displayList(thisWeekDiv, newRotation, "This Week’s List");
        
        // Optional: Provide feedback that the old list is now the "Last Week" list.
        document.getElementById("instructions").textContent = "Rotation complete! Click the button again next week to update the lists.";
    });

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});