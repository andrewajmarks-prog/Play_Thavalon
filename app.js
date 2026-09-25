const SUPABASE_URL = "https://gqtuupyqhgqbismnlssl.supabase.co";
const SUPABASE_KEY = "sb_publishable_4tCAGKB8-k5rvfsFDeAlLA_iPWWbByI";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const firstWords = [
    "Arthurs",
    "Guineveres",
    "Merlins",
    "Morganas",
    "Mordreds",
    "Lancelots",
    "Gawains",
    "Gareths",
    "Kays",
    "Percivals",
    "Tristans",
    "Iseults",
    "Nimues",
    "Uthers",
    "Igraines",
    "Elaines",
    "Bediveres",
    "Galahads",
    "Bors",
    "Agravaines",
    "Camelots",
    "Avalons",
    "Tintagels",
    "Camlanns"
];

const secondWords = [
    "Sword",
    "Crown",
    "RoundTable",
    "Scabbard",
    "Shield",
    "Spear",
    "Chalice",
    "Grail",
    "Stone",
    "Tower",
    "Castle",
    "Throne",
    "Banner",
    "Cloak",
    "Ring",
    "Mirror",
    "Book",
    "Bell",
    "Rose",
    "Raven",
    "Dragon",
    "Oak",
    "Forest",
    "Lake"
];

function generateGameCode() {
    const first =
        firstWords[Math.floor(Math.random() * firstWords.length)];

    const second =
        secondWords[Math.floor(Math.random() * secondWords.length)];

    return `${first}-${second}`.toUpperCase();
}

const playerInput = document.getElementById("playerInput");
const addButton = document.getElementById("addButton");
const playerList = document.getElementById("playerList");
const playerCount = document.getElementById("playerCount");
const startButton = document.getElementById("startButton");
const gameCreated = document.getElementById("gameCreated");
const gameCodeDisplay = document.getElementById("gameCodeDisplay");
const allowedPlayerCount = [5,7,8,10];

let players = [];

function addPlayer() {
    const name = playerInput.value.trim();

    if (name === "") {
        return;
    }

    players.push(name);

    playerInput.value = "";

    renderPlayers();

    // Keep the input focused on mobile.
    playerInput.focus();
}

function removePlayer(index) {
    players.splice(index, 1);

    renderPlayers();

    // Keep the input ready for another player.
    playerInput.focus();
}

function renderPlayers() {
    playerList.innerHTML = "";

    players.forEach((player, index) => {

        const playerElement = document.createElement("div");
        playerElement.className = "player";

        const nameElement = document.createElement("span");
        nameElement.textContent = player;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removePlayer(index);
        });

        playerElement.appendChild(nameElement);
        playerElement.appendChild(removeButton);

        playerList.appendChild(playerElement);
    });

    playerCount.textContent =
        players.length === 1
            ? "1 player"
            : `${players.length} players`;
}

addButton.addEventListener("click", addPlayer);

playerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addPlayer();
    }
});

startButton.addEventListener("click", () => {
    console.log("Players:", players);
});

startButton.addEventListener("click", async () => {
    if (!allowedPlayerCount.includes(players.length)) {
        alert("Incorrect player count. Must have 5, 7, 8, or 10 players.");
        return;
    }
    // if (players.length !== 0) {
    //     alert("Add at least one player.");
    //     return;
    // }

    // Create a unique ID for this game.
    const gameId = crypto.randomUUID();
    
    // Generate the short game code.
    const gameCode = generateGameCode();

    // Create the game.
    const { error: gameError } = await supabaseClient
        .from("games")
        .insert({
            id: gameId,
            title: "Thavalon Game",
            game_code: gameCode
        });

    if (gameError) {
        console.error("Error creating game:", gameError);
        alert(`Could not create the game:\n${gameError.message}`);
        return;
    }

    // Create a player record for each player.
    const playerRows = players.map((name) => ({
        game_id: gameId,
        name: name
    }));

    const { error: playerError } = await supabaseClient
        .from("players")
        .insert(playerRows);

    if (playerError) {
        console.error("Error creating players:", playerError);
        alert(`Game created, but could not save the players:\n${playerError.message}`);
        return;
    }

    console.log("Game created:", gameId);
    console.log("Game code:", gameCode);
    console.log("Players created:", playerRows);
    
    window.location.href = `game.html?code=${gameCode}`;
});
