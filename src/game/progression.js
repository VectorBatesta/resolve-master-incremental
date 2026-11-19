import { gameVariables } from "./state.js";
import { addLoreMessage } from "../ui/constructors.js";
import { updateButtonsDisplay, updateEffectsDisplay } from "../ui/render.js";

function triggerOnce(triggerId, condition, callback) {
    if (!gameVariables.progression.triggers[triggerId] && condition) {
        gameVariables.progression.triggers[triggerId] = true;
        callback();
    }
}

export function progressionDetection() {
    const essence = gameVariables.resources.essence.amount;
    const condensedEssence = gameVariables.resources.condensedEssence.amount;

    triggerOnce("essenceAbsorptionStarted", essence >= 2, () => {
        addLoreMessage("You begin to absorb the essence around you.");
    });

    if (!gameVariables.status.essenceHindranceRevealed && essence >= 4) {
        gameVariables.status.essenceHindranceRevealed = true;
        addLoreMessage("You feel that accumulating essence is getting harder than it should...");
        updateEffectsDisplay();
    }

    if (!gameVariables.unlocks.essenceCondensation && essence >= 5) {
        gameVariables.unlocks.essenceCondensation = true;
        addLoreMessage("The essence within you feels dense enough to condense.");
        updateButtonsDisplay();
    }

    triggerOnce("firstCondensedEssence", condensedEssence > 0, () => {
        addLoreMessage("You force the gathered essence into a denser, more stable form.");
    });
}
