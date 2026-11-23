import { RESOURCE_DEFINITIONS } from "../data/resources.js";
import { gameVariables } from "./state.js";

export function fixMaxAll() {
    for (const resource of Object.values(gameVariables.resources)) {
        if (resource.amount > resource.max) {
            resource.amount = resource.max;
        }
    }
}

export function getCondensationSuccessChance() {
    const condensedEssence = gameVariables.resources.condensedEssence;
    const condensation = RESOURCE_DEFINITIONS.essence.condensation;
    const hindrancePower = Math.max(
        0,
        gameVariables.modifiers.condensationHindrance
    ) / 100;

    const projectedAmount = condensedEssence.amount + condensation.output;
    const excessCondensedEssence = Math.max(
        0,
        projectedAmount - condensation.guaranteedUntil
    );

    return Math.max(
        0,
        Math.min(1, 1 - excessCondensedEssence * hindrancePower)
    );
}

export function getCondensationFailureChance() {
    return 1 - getCondensationSuccessChance();
}
