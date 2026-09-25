import { assignCharacters } from "./RollGame.js";

const SUPABASE_URL = "https://gqtuupyqhgqbismnlssl.supabase.co";
const SUPABASE_KEY = "sb_publishable_4tCAGKB8-k5rvfsFDeAlLA_iPWWbByI";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const gameCodeElement = document.getElementById("gameCode");
const playerSelect = document.getElementById("playerSelect");
const playerInformationElement = document.getElementById("playerInformation");

// Get the game code from the URL.
const urlParams = new URLSearchParams(window.location.search);
const gameCode = urlParams.get("code");

gameCodeElement.textContent = gameCode || "No game code";

// Stop if there is no code.
if (!gameCode) {
    playerList.textContent = "No game code provided.";
} else {
    loadGame();
}

async function loadGame() {
    // Find the game using its short code.
    const { data: game, error: gameError } = await supabaseClient
        .from("games")
        .select("id, game_code, title")
        .eq("game_code", gameCode.toUpperCase())
        .single();

    if (gameError) {
        console.error("Error finding game:", gameError);
        playerList.textContent = "Game not found.";
        return;
    }

    // Get the players belonging to this game.
    const { data: players, error: playerError } = await supabaseClient
        .from("players")
        .select("name")
        .eq("game_id", game.id);

    if (playerError) {
        console.error("Error loading players:", playerError);
        playerList.textContent = "Could not load players.";
        return;
    }

    const playerNames = players.map((player) => player.name);

    const assignments = assignCharacters(playerNames);

    console.log("Character assignments:", playerInformation);

assignments.forEach((player) => {
    const option = document.createElement("option");

    option.value = player.name;
    option.textContent = player.name;

    playerSelect.appendChild(option);
});

playerSelect.addEventListener("change", () => {
    const selectedName = playerSelect.value;

    if (!selectedName) {
        playerInformationElement.textContent = "";
        return;
    }

    const selectedPlayer = assignments.find(
        player => player.name === selectedName
    );

    playerInformationElement.textContent = selectedPlayer.playerEntry;
});
}
