import { STATUS_EFFECT_DEFINITIONS } from "./data/statusEffects.js";
import { focus } from "./game/actions.js";
import { progressionDetection } from "./game/progression.js";
import { gameVariables } from "./game/state.js";
import {
    loadGame,
    saveGame,
    saveWipe,
    startAutosave
} from "./systems/save.js";
import {
    newButton,
    newHoldableButton,
    newStatusEffect,
    screen
} from "./ui/constructors.js";
import {
    updateEffectsDisplay,
    updateResourcesDisplay
} from "./ui/render.js";

function addWelcomeLore() {
    const loreList = document.getElementById("loreList");
    const welcomeLore = document.createElement("li");
    welcomeLore.classList.add("lore");

    if (gameVariables.wipingSave) {
        welcomeLore.classList.add("newLore");
        welcomeLore.textContent = "You wake up in the middle of nowhere.";
        gameVariables.wipingSave = false;
    }
    else {
        welcomeLore.textContent = "You wake up where you left off.";
    }

    loreList.appendChild(welcomeLore);
}

function createGameButtons() {
    const btnFocus = newHoldableButton("btn_focus", "Focus", focus, 500);
    const btnSaveWipe = newButton("btn_saveWipe", "TERMINATE SAVE", saveWipe);

    btnFocus.classList.add("_visible");
    btnSaveWipe.classList.add("_visible");
}

function createStatusEffects() {
    for (const [effectId, definition] of Object.entries(STATUS_EFFECT_DEFINITIONS)) {
        newStatusEffect(
            effectId,
            definition.imageName,
            definition.title,
            definition.description,
            definition.amountBuffs,
            definition.curse
        );
    }
}

function gameOnLoad() {
    loadGame();

    screen(1);
    addWelcomeLore();
    createGameButtons();
    createStatusEffects();

    updateResourcesDisplay();
    updateEffectsDisplay();

    setInterval(updateResourcesDisplay, 100);
    setInterval(updateEffectsDisplay, 100);
    setInterval(progressionDetection, 100);
    startAutosave();
}

window.addEventListener("DOMContentLoaded", gameOnLoad);
window.addEventListener("beforeunload", saveGame);
