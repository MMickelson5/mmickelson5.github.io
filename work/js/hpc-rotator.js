function createNewRotation(list) {
    const permanents = list.filter(p => p.permanent);
    const nonPermanents = list.filter(p => !p.permanent);

    // Exclude people who worked last week
    const eligible = nonPermanents.filter(p => !p.workedLastWeek);

    // Weight selection — those who prefer HPC get higher odds
    const weightedPool = eligible.flatMap(p => {
        const weight = p.preference ? 3 : 1; // 3x chance if they prefer HPC
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
