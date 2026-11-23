import { getCondensationFailureChance } from "../game/resources.js";

export const SELF_EXAMINATION_CURSE_IDS = [
    "movementImpairment",
    "workImpairment",
    "hardOfHearing",
    "blindness",
    "bleeding"
];

export const STATUS_EFFECT_DEFINITIONS = {
    essenceHindrance: {
        imageName: "placeholder.png",
        title: "Essence Accumulation Hindrance",
        description: "Something is resisting your attempts to accumulate essence.",
        amountLines: 1,
        curse: true,
        revealStatusKey: "essenceHindranceRevealed",
        isVisible(gameVariables) {
            return gameVariables.status.essenceHindranceRevealed;
        },
        getDetailTexts(gameVariables) {
            return [
                "Curse Power: " + gameVariables.modifiers.essenceHindrance
            ];
        }
    },
    condensationHindrance: {
        imageName: "placeholder.png",
        title: "Essence Condensation Hindrance",
        description: "Something is destabilizing your attempts to condense essence.",
        amountLines: 1,
        curse: true,
        revealStatusKey: "condensationHindranceRevealed",
        isVisible(gameVariables) {
            return gameVariables.status.condensationHindranceRevealed;
        },
        getDetailTexts() {
            return [
                "Current failure chance: " +
                (getCondensationFailureChance() * 100).toFixed(1) + "%"
            ];
        }
    },
    movementImpairment: {
        imageName: "placeholder.png",
        title: "Movement Impairment",
        description: "Your body is missing something fundamental for movement.",
        amountLines: 1,
        curse: true,
        purgeOnly: true,
        revealBucket: "selfExamination",
        revealStatusKey: "movementImpairmentRevealed",
        isVisible(gameVariables) {
            return gameVariables.status.movementImpairmentRevealed;
        },
        getDetailTexts() {
            return ["You don't have the right leg."];
        }
    },
    workImpairment: {
        imageName: "placeholder.png",
        title: "Work Impairment",
        description: "Even simple physical work is severely limited.",
        amountLines: 1,
        curse: true,
        purgeOnly: true,
        revealBucket: "selfExamination",
        revealStatusKey: "workImpairmentRevealed",
        isVisible(gameVariables) {
            return gameVariables.status.workImpairmentRevealed;
        },
        getDetailTexts() {
            return ["You don't have the left arm."];
        }
    },
    hardOfHearing: {
        imageName: "placeholder.png",
        title: "Hard of Hearing",
        description: "The world reaches you without sound.",
        amountLines: 1,
        curse: true,
        purgeOnly: true,
        revealBucket: "selfExamination",
        revealStatusKey: "hardOfHearingRevealed",
        isVisible(gameVariables) {
            return gameVariables.status.hardOfHearingRevealed;
        },
        getDetailTexts() {
            return ["You are deaf."];
        }
    },
    blindness: {
        imageName: "placeholder.png",
        title: "Blindness",
        description: "Your sight is severely damaged.",
        amountLines: 2,
        curse: true,
        purgeOnly: true,
        revealBucket: "selfExamination",
        revealStatusKey: "blindnessRevealed",
        isVisible(gameVariables) {
            return gameVariables.status.blindnessRevealed;
        },
        getDetailTexts() {
            return [
                "Blind in the right eye.",
                "Your left eye is missing."
            ];
        }
    },
    bleeding: {
        imageName: "placeholder.png",
        title: "Bleeding",
        description: "Your body is failing to retain its blood.",
        amountLines: 1,
        curse: true,
        purgeOnly: true,
        critical: true,
        revealBucket: "selfExamination",
        revealStatusKey: "bleedingRevealed",
        isVisible(gameVariables) {
            return gameVariables.status.bleedingRevealed;
        },
        isCritical(gameVariables) {
            return !gameVariables.progression.triggers.bleedingStemmed;
        },
        getDetailTexts(gameVariables) {
            if (gameVariables.progression.triggers.bleedingStemmed) {
                return ["The bleeding has been stemmed."];
            }

            return ["Currently losing blood rapidly."];
        }
    }
};
