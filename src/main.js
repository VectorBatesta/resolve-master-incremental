import { STATUS_EFFECT_DEFINITIONS } from "./data/statusEffects.js";
import {
    absorbEssence,
    condenseEssence,
    examineSelf,
    resumeSelfExamination,
    stemBleeding
} from "./game/actions.js";
import { progressionDetection, purgeTabOpened } from "./game/progression.js";
import { initializeExploration } from "./game/exploration.js";
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
    newCostButton,
    newHoldableButton,
    newStatusEffect,
    newTabButton,
    screen
} from "./ui/constructors.js";
import {
    updateButtonsDisplay,
    updateEffectsDisplay,
    updateExplorationDisplay,
    updateResourcesDisplay,
    updateTabsDisplay
} from "./ui/render.js";

const DEBUG_MODE = new URLSearchParams(window.location.search).get("debug") === "1";

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
        DEBUG_MODE ? 50 : 500
    );
    newButton("btn_condenseEssence", "Condense Essence", condenseEssence);
    const btnSaveWipe = newButton("btn_saveWipe", "TERMINATE SAVE", saveWipe);
    newButton("btn_examineSelf", "Examine Self", examineSelf, "tab2_divEsq");
    newCostButton(
        "btn_stemBleeding",
        "3 Solidified Essence",
        "Stem the Flow of Blood",
        stemBleeding,
        "tab2_divEsq"
    );

    btnAbsorbEssence.classList.add("_visible");
    btnSaveWipe.classList.add("_visible");
}

function createTabs() {
    newTabButton("tabButton_core", "Core", 1, () => {
        screen(1);
    });

    newTabButton("tabButton_purge", "Purge", 2, () => {
        screen(2);
        purgeTabOpened();
    });

    newTabButton("tabButton_explore", "Retro-transposition", 3, () => {
        screen(3);
        updateExplorationDisplay();
    });
}

function createStatusEffects() {
    for (const [effectId, definition] of Object.entries(STATUS_EFFECT_DEFINITIONS)) {
        newStatusEffect(
            effectId,
            definition.imageName,
            definition.title,
            definition.description,
            definition.amountLines,
            definition.curse,
            definition.purgeOnly,
            definition.critical
        );
    }
}

function gameOnLoad() {
    loadGame();

    screen(gameVariables.exploration.active ? 3 : 1);
    addWelcomeLore();
    createGameButtons();
    createTabs();
    createStatusEffects();

    updateResourcesDisplay();
    updateEffectsDisplay();
    updateButtonsDisplay();
    updateTabsDisplay();
    progressionDetection();
    resumeSelfExamination();
    initializeExploration();

    window.addEventListener("bleedingStemmed", () => {
        addLoreMessage("You are no longer on the verge of death.");
    });

    setInterval(updateResourcesDisplay, 100);
    setInterval(updateEffectsDisplay, 100);
    setInterval(progressionDetection, 100);
    startAutosave();
}

window.addEventListener("DOMContentLoaded", gameOnLoad);
window.addEventListener("beforeunload", saveGame);
