const fs = require('fs');

// Input and output file paths
const inputFile = './data/input.json';
const outputFile = './data/draft-test.json';

// Read input JSON file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading input file:', err);
        return;
    }

    // Parse the input JSON
    let draftData = JSON.parse(data);
    let picks = draftData.picks.sort((a, b) => a.actualPickNumber - b.actualPickNumber);

    // Create a blank draft structure
    let blankDraft = {
        picks: picks.map(pick => ({
            id: pick.id,
            pickNumber: pick.pickNumber,
            actualPickNumber: pick.actualPickNumber,
            timedOut: false,
            pickByTime: null,
            pickedAt: null,
            isActivePick: pick.actualPickNumber === 1,
            map: { id: null, name: null, inGameName: null },
            spawnLocation: { id: null, name: null, x: null, y: null, inGameDropId: null },
            player: { id: null, name: null, frontImage: null },
            team: pick.team
        }))
    };

    // Write the blank draft to the output file
    fs.writeFileSync(outputFile, JSON.stringify(blankDraft, null, 2));
    console.log('Blank draft created. Press any key to start the draft...');

    // Wait for user input to start
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', () => {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.log('Draft started!');
        startDraftSimulation();
    });

    function startDraftSimulation() {
        let currentPickIndex = 0;

        function processNextPick() {
            if (currentPickIndex >= picks.length) {
                console.log('Draft simulation complete.');
                return;
            }

            let draftData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

            // Get the current pick to update
            let pickToUpdate = draftData.picks[currentPickIndex];

            // Simulated data (Replace with real data if available)
            let simulatedPick = picks[currentPickIndex];

            // Update the pick details
            pickToUpdate.pickByTime = new Date().toISOString();
            pickToUpdate.pickedAt = new Date().toISOString();
            pickToUpdate.isActivePick = false;
            pickToUpdate.map = simulatedPick.map;
            pickToUpdate.spawnLocation = simulatedPick.spawnLocation;
            pickToUpdate.player = simulatedPick.player;

            // If there's a next pick, mark it as active
            if (currentPickIndex + 1 < picks.length) {
                draftData.picks[currentPickIndex + 1].isActivePick = true;
            }

            // Write the updated draft back to the file
            fs.writeFileSync(outputFile, JSON.stringify(draftData, null, 2));

            console.log(`Pick ${simulatedPick.actualPickNumber} completed.`);

            currentPickIndex++;

            // Schedule the next pick in 10 seconds
            setTimeout(processNextPick, 3000);
        }

        // Start the first pickt
        processNextPick();
    }
});