import { RESOURCE_DEFINITIONS } from "../data/resources.js";
import { gameVariables } from "./state.js";
import { fixMaxAll } from "./resources.js";
import { updateResourcesDisplay } from "../ui/render.js";

export function getEssenceAbsorptionGain() {
    const essence = gameVariables.resources.essence;
    const absorption = RESOURCE_DEFINITIONS.essence.absorption;
    const hindrancePower = Math.max(0, gameVariables.modifiers.essenceHindrance) / 100;

    const accumulatedEssence = essence.amount / absorption.hindrancePivot;
    const hindrance = 1 + hindrancePower * Math.pow(
        accumulatedEssence,
        absorption.hindranceCurvePower
    );

    return absorption.baseGain / hindrance;
}

export function absorbEssence() {
    gameVariables.resources.essence.amount += getEssenceAbsorptionGain();

    fixMaxAll();
    updateResourcesDisplay();
}

export function condenseEssence() {
    const essence = gameVariables.resources.essence;
    const condensedEssence = gameVariables.resources.condensedEssence;
    const condensation = RESOURCE_DEFINITIONS.essence.condensation;

    if (
        essence.amount >= condensation.cost &&
        condensedEssence.amount < condensedEssence.max
    ) {
        essence.amount -= condensation.cost;
        condensedEssence.amount += condensation.output;

        fixMaxAll();
        updateResourcesDisplay();
    }
}
