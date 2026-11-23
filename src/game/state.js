import { RESOURCE_DEFINITIONS } from "../data/resources.js";

export const SAVE_VERSION = 8;

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
            essenceHindranceRevealed: false,
            condensationHindranceRevealed: false,
            movementImpairmentRevealed: false,
            workImpairmentRevealed: false,
            hardOfHearingRevealed: false,
            blindnessRevealed: false,
            bleedingRevealed: false
        },
        unlocks: {
            essenceCondensation: false,
            purge: false,
            exploration: false
        },
        progression: {
            triggers: {
                essenceAbsorptionStarted: false,
                firstCondensedEssence: false,
                purgeOpened: false,
                selfExamined: false,
                selfExaminationComplete: false,
                bleedingStemmed: false
            },
            stats: {
                condensationAttempts: 0,
                condensationSuccesses: 0,
                condensationFailures: 0
            }
        },
        exploration: {
            active: false,
            selectedEssence: 0.5,
            carriedEssence: 0,
            x: 0,
            y: 0,
            seed: 0,
            movementHintDismissed: false
        },
        modifiers: {
            essenceHindrance: 100,
            condensationHindrance: 20
        },
        resources: createDefaultResources(),
        wipingSave: true
    };
}

export let gameVariables = createNewSave();

export function setGameVariables(newGameVariables) {
    gameVariables = newGameVariables;
}
