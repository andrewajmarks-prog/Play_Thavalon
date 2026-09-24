const playerInput = document.getElementById("playerInput");
const addButton = document.getElementById("addButton");
const playerList = document.getElementById("playerList");

let players = [];

function addPlayer() {
    const name = playerInput.value.trim();

    if (name === "") {
        return;
    }

    players.push(name);

    playerInput.value = "";

    renderPlayers();

    // Put the cursor back in the input.
    playerInput.focus();
}

function removePlayer(index) {
    players.splice(index, 1);
    renderPlayers();

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
}

addButton.addEventListener("click", addPlayer);

playerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        addPlayer();
    }
});
