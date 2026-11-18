import { RESOURCE_DEFINITIONS } from "../data/resources.js";

export const SAVE_VERSION = 1;

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
        status: {},
        modifiers: {
            focusHindrance: 100
        },
        resources: createDefaultResources(),
        wipingSave: true
    };
}

export let gameVariables = createNewSave();

export function setGameVariables(newGameVariables) {
    gameVariables = newGameVariables;
}
