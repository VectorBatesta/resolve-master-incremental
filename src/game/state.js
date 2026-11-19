import { RESOURCE_DEFINITIONS } from "../data/resources.js";

export const SAVE_VERSION = 2;

function createDefaultResources() {
    const resources = {};

    for (const [resourceId, definition] of Object.entries(RESOURCE_DEFINITIONS)) {
        resources[resourceId] = {
            amount: definition.defaultAmount,
            max: definition.defaultMax
        };
    }

    return resources;
}

export function createNewSave() {
    return {
        version: SAVE_VERSION,
        status: {
            essenceHindranceRevealed: false
        },
        unlocks: {
            essenceCondensation: false
        },
        progression: {
            triggers: {
                essenceAbsorptionStarted: false,
                firstCondensedEssence: false
            }
        },
        modifiers: {
            essenceHindrance: 100
        },
        resources: createDefaultResources(),
        wipingSave: true
    };
}

export let gameVariables = createNewSave();

export function setGameVariables(newGameVariables) {
    gameVariables = newGameVariables;
}
