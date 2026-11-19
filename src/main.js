import { STATUS_EFFECT_DEFINITIONS } from "./data/statusEffects.js";
import { absorbEssence, condenseEssence } from "./game/actions.js";
import { progressionDetection } from "./game/progression.js";
import { gameVariables } from "./game/state.js";
import {
    loadGame,
    saveGame,
    saveWipe,
    startAutosave
} from "./systems/save.js";
import {
    addLoreMessage,
    newButton,
    newHoldableButton,
    newStatusEffect,
    screen
} from "./ui/constructors.js";
import {
    updateButtonsDisplay,
    updateEffectsDisplay,
    updateResourcesDisplay
} from "./ui/render.js";

function addWelcomeLore() {
    if (gameVariables.wipingSave) {
        addLoreMessage("You wake up in the middle of nowhere.");
        gameVariables.wipingSave = false;
    }
    else {
        addLoreMessage("You wake up where you left off.", false);
    }
}

function createGameButtons() {
    const btnAbsorbEssence = newHoldableButton(
        "btn_absorbEssence",
        "Absorb Essence",
        absorbEssence,
        500
    );
    newButton("btn_condenseEssence", "Condense Essence", condenseEssence);
    const btnSaveWipe = newButton("btn_saveWipe", "TERMINATE SAVE", saveWipe);

    btnAbsorbEssence.classList.add("_visible");
    btnSaveWipe.classList.add("_visible");
}

function createStatusEffects() {
    for (const [effectId, definition] of Object.entries(STATUS_EFFECT_DEFINITIONS)) {
        newStatusEffect(
            effectId,
            definition.imageName,
            definition.title,
            definition.description,
            definition.amountLines,
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
    updateButtonsDisplay();
    progressionDetection();

    setInterval(updateResourcesDisplay, 100);
    setInterval(updateEffectsDisplay, 100);
    setInterval(progressionDetection, 100);
    startAutosave();
}

window.addEventListener("DOMContentLoaded", gameOnLoad);
window.addEventListener("beforeunload", saveGame);
