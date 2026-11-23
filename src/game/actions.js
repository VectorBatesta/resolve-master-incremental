import { RESOURCE_DEFINITIONS } from "../data/resources.js";
import {
    SELF_EXAMINATION_CURSE_IDS,
    STATUS_EFFECT_DEFINITIONS
} from "../data/statusEffects.js";
import { gameVariables } from "./state.js";
import {
    fixMaxAll,
    getCondensationSuccessChance
} from "./resources.js";
import {
    flashButtonCost,
    flashStatusEffect,
    updateButtonsDisplay,
    updateEffectsDisplay,
    updateResourcesDisplay,
    updateTabsDisplay
} from "../ui/render.js";

const SELF_EXAMINATION_REVEAL_INTERVAL_MS = 1500;
let selfExaminationRevealTimer = null;

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
        gameVariables.progression.stats.condensationAttempts += 1;

        if (Math.random() <= getCondensationSuccessChance()) {
            condensedEssence.amount += condensation.output;
            gameVariables.progression.stats.condensationSuccesses += 1;
        }
        else {
            gameVariables.progression.stats.condensationFailures += 1;
        }

        fixMaxAll();
        updateResourcesDisplay();
        updateEffectsDisplay();
    }
}

export function stemBleeding() {
    const condensedEssence = gameVariables.resources.condensedEssence;
    const cost = 3;

    if (gameVariables.progression.triggers.bleedingStemmed) {
        return;
    }

    if (condensedEssence.amount < cost) {
        flashButtonCost("btn_stemBleeding");
        return;
    }

    condensedEssence.amount -= cost;
    gameVariables.progression.triggers.bleedingStemmed = true;
    gameVariables.unlocks.exploration = true;

    fixMaxAll();
    updateResourcesDisplay();
    updateEffectsDisplay();
    updateButtonsDisplay();
    updateTabsDisplay();

    const event = new CustomEvent("bleedingStemmed");
    window.dispatchEvent(event);
}

function getNextSelfExaminationCurse() {
    return SELF_EXAMINATION_CURSE_IDS.find((curseId) => {
        const definition = STATUS_EFFECT_DEFINITIONS[curseId];
        return !gameVariables.status[definition.revealStatusKey];
    });
}

function revealNextSelfExaminationCurse() {
    const curseId = getNextSelfExaminationCurse();

    if (!curseId) {
        gameVariables.progression.triggers.selfExaminationComplete = true;
        selfExaminationRevealTimer = null;
        return;
    }

    const definition = STATUS_EFFECT_DEFINITIONS[curseId];
    gameVariables.status[definition.revealStatusKey] = true;

    updateEffectsDisplay();
    updateButtonsDisplay();
    flashStatusEffect(curseId);

    if (getNextSelfExaminationCurse()) {
        selfExaminationRevealTimer = setTimeout(
            revealNextSelfExaminationCurse,
            SELF_EXAMINATION_REVEAL_INTERVAL_MS
        );
    }
    else {
        gameVariables.progression.triggers.selfExaminationComplete = true;
        selfExaminationRevealTimer = null;
    }
}

export function resumeSelfExamination() {
    if (
        gameVariables.progression.triggers.selfExamined &&
        !gameVariables.progression.triggers.selfExaminationComplete &&
        !selfExaminationRevealTimer
    ) {
        revealNextSelfExaminationCurse();
    }
}

export function examineSelf() {
    if (gameVariables.progression.triggers.selfExamined) {
        return;
    }

    gameVariables.progression.triggers.selfExamined = true;
    gameVariables.progression.triggers.selfExaminationComplete = false;

    updateEffectsDisplay();
    updateButtonsDisplay();
    revealNextSelfExaminationCurse();
}
