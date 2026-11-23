import { gameVariables } from "./state.js";
import { addLoreMessage } from "../ui/constructors.js";
import {
    updateExplorationDisplay,
    updateResourcesDisplay,
    updateTabsDisplay
} from "../ui/render.js";

const VIEW_SIZE = 11;
const VIEW_RADIUS = Math.floor(VIEW_SIZE / 2);
const ESSENCE_STEP = 0.5;
const MOVEMENT_COST = 0.5;

function createExplorationSeed() {
    return Math.floor(Math.random() * 2147483646) + 1;
}

function coordinateNoise(x, y) {
    let value = Math.imul(x, 374761393);
    value = (value + Math.imul(y, 668265263)) | 0;
    value = (value + Math.imul(gameVariables.exploration.seed, 1442695041)) | 0;
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    value ^= value >>> 16;

    return (value >>> 0) / 4294967295;
}

function getTerrainClass(x, y) {
    const noise = coordinateNoise(x, y);

    if (noise < 0.50) {
        return "terrainEmpty";
    }
    if (noise < 0.70) {
        return "terrainDust";
    }
    if (noise < 0.90) {
        return "terrainMist";
    }

    return "terrainDense";
}

export function renderExplorationMap() {
    const map = document.getElementById("explorationMap");

    if (!map || !gameVariables.exploration.active) {
        return;
    }

    map.replaceChildren();

    for (let row = 0; row < VIEW_SIZE; row++) {
        for (let column = 0; column < VIEW_SIZE; column++) {
            const worldX = gameVariables.exploration.x + column - VIEW_RADIUS;
            const worldY = gameVariables.exploration.y + row - VIEW_RADIUS;
            const tile = document.createElement("div");

            tile.classList.add("explorationTile", getTerrainClass(worldX, worldY));
            tile.dataset.x = worldX;
            tile.dataset.y = worldY;

            if (row === VIEW_RADIUS && column === VIEW_RADIUS) {
                tile.classList.add("playerTile");
            }

            map.appendChild(tile);
        }
    }
}

function dismissMovementHint() {
    const hint = document.getElementById("movementHint");

    gameVariables.exploration.movementHintDismissed = true;

    if (hint) {
        hint.classList.add("_faded");
    }
}

function endExploration() {
    gameVariables.exploration.active = false;
    gameVariables.exploration.carriedEssence = 0;

    document.getElementById("gameScreen")?.classList.remove("explorationActive");

    updateExplorationDisplay();
    updateTabsDisplay();
}

function movePlayer(x, y) {
    if (gameVariables.exploration.carriedEssence < MOVEMENT_COST) {
        endExploration();
        return;
    }

    gameVariables.exploration.carriedEssence -= MOVEMENT_COST;
    gameVariables.exploration.x += x;
    gameVariables.exploration.y += y;

    dismissMovementHint();
    renderExplorationMap();
    updateExplorationDisplay();
}

function handleMovement(event) {
    const explorationTab = document.getElementById("tab3");
    const activeElement = document.activeElement;

    if (!gameVariables.exploration.active || !explorationTab?.classList.contains("_visible")) {
        return;
    }

    if (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.isContentEditable
    ) {
        return;
    }

    const key = event.key.toLowerCase();
    const movement = {
        arrowup: [0, -1],
        w: [0, -1],
        arrowdown: [0, 1],
        s: [0, 1],
        arrowleft: [-1, 0],
        a: [-1, 0],
        arrowright: [1, 0],
        d: [1, 0]
    }[key];

    if (!movement) {
        return;
    }

    event.preventDefault();
    movePlayer(movement[0], movement[1]);
}

export function changeExplorationEssence(direction) {
    if (gameVariables.exploration.active) {
        return;
    }

    const available = gameVariables.resources.condensedEssence.amount;
    const nextAmount = gameVariables.exploration.selectedEssence + direction * ESSENCE_STEP;

    gameVariables.exploration.selectedEssence = Math.max(
        0,
        Math.min(available, Math.round(nextAmount * 2) / 2)
    );

    updateExplorationDisplay();
}

export function startExploration() {
    const condensedEssence = gameVariables.resources.condensedEssence;
    const selectedEssence = gameVariables.exploration.selectedEssence;
    const selection = document.getElementById("explorationEssenceSelection");

    if (selectedEssence < MOVEMENT_COST || condensedEssence.amount < selectedEssence) {
        if (selection) {
            selection.classList.remove("selectionInsufficientFlash");
            void selection.offsetWidth;
            selection.classList.add("selectionInsufficientFlash");
        }
        return;
    }

    condensedEssence.amount -= selectedEssence;
    gameVariables.exploration.active = true;
    gameVariables.exploration.carriedEssence = selectedEssence;
    gameVariables.exploration.x = 0;
    gameVariables.exploration.y = 0;
    gameVariables.exploration.seed = createExplorationSeed();
    gameVariables.exploration.movementHintDismissed = false;

    document.getElementById("gameScreen")?.classList.add("explorationActive");

    updateResourcesDisplay();
    updateExplorationDisplay();
    updateTabsDisplay();
    renderExplorationMap();
}

export function initializeExploration() {
    const decreaseButton = document.getElementById("explorationEssenceDecrease");
    const increaseButton = document.getElementById("explorationEssenceIncrease");
    const exploreButton = document.getElementById("btn_startExploration");
    const hint = document.getElementById("movementHint");

    decreaseButton?.addEventListener("click", () => changeExplorationEssence(-1));
    increaseButton?.addEventListener("click", () => changeExplorationEssence(1));
    exploreButton?.addEventListener("click", startExploration);

    if (gameVariables.exploration.active) {
        document.getElementById("gameScreen")?.classList.add("explorationActive");
    }

    if (gameVariables.exploration.movementHintDismissed && hint) {
        hint.classList.add("_faded");
    }

    updateExplorationDisplay();

    if (gameVariables.exploration.active) {
        renderExplorationMap();
    }

    window.addEventListener("keydown", handleMovement);
}
