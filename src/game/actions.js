import { gameVariables } from "./state.js";
import { fixMaxAll } from "./resources.js";
import { updateResourcesDisplay } from "../ui/render.js";

export function getFocusGain() {
    const essence = gameVariables.resources.essence;
    const focusHindrance = gameVariables.modifiers.focusHindrance;

    let growth = 1 - (essence.amount / essence.max);
    growth = Math.max(0, growth);

    if (focusHindrance > 0) {
        growth = Math.pow(growth, focusHindrance / 10);
    }

    return growth;
}

export function focus() {
    gameVariables.resources.essence.amount += getFocusGain();

    fixMaxAll();
    updateResourcesDisplay();
}
