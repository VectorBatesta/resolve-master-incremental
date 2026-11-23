import { RESOURCE_DEFINITIONS } from "../data/resources.js";
import {
    SELF_EXAMINATION_CURSE_IDS,
    STATUS_EFFECT_DEFINITIONS
} from "../data/statusEffects.js";
import { gameVariables } from "../game/state.js";

export function updateResourcesDisplay() {
    const resourceLists = document.getElementsByClassName("resourceList");

    for (const [resourceId, resource] of Object.entries(gameVariables.resources)) {
        const definition = RESOURCE_DEFINITIONS[resourceId];
        const label = definition?.label || resourceId;
        const decimals = definition?.decimals ?? 2;

        for (const resourceList of resourceLists) {
            let listItem = Array.from(resourceList.children).find(
                (child) => child.dataset.resourceId === resourceId
            );

            if (resource.amount <= 0) {
                if (listItem) {
                    listItem.remove();
                }
                continue;
            }

            if (!listItem) {
                listItem = document.createElement("li");
                listItem.classList.add("resource", resourceId);
                listItem.dataset.resourceId = resourceId;
                resourceList.appendChild(listItem);
            }

            listItem.textContent =
                label.toUpperCase() + ": " + resource.amount.toFixed(decimals);
        }
    }
}

export function updateEffectsDisplay() {
    const statuses = document.getElementsByClassName("status");

    for (const status of statuses) {
        const definition = STATUS_EFFECT_DEFINITIONS[status.dataset.effectId];

        if (!definition) {
            continue;
        }

        const critical = definition.isCritical
            ? definition.isCritical(gameVariables)
            : Boolean(definition.critical);
        status.classList.toggle("criticalCurse", critical);

        const isPurgeList = status.parentElement.classList.contains("purgeStatusList");
        const visibleByDiscovery = definition.isVisible
            ? definition.isVisible(gameVariables)
            : true;
        const visible = isPurgeList
            ? gameVariables.progression.triggers.selfExamined && visibleByDiscovery
            : visibleByDiscovery;

        status.style.display = visible ? "flex" : "none";

        if (!visible) {
            continue;
        }

        const detailTexts = definition.getDetailTexts(gameVariables);
        const detailElements = status.getElementsByClassName("effect_detail_text");

        for (let i = 0; i < detailElements.length; i++) {
            detailElements[i].textContent = detailTexts[i] || "";
        }
    }

    updateCurseVignette();
}

export function flashStatusEffect(effectId) {
    const status = document.querySelector(
        `.purgeStatusList .status[data-effect-id="${effectId}"]`
    );

    if (!status) {
        return;
    }

    status.classList.remove("curseRevealFlash");
    void status.offsetWidth;
    status.classList.add("curseRevealFlash");

    setTimeout(() => {
        status.classList.remove("curseRevealFlash");
    }, 1000);
}

export function flashButtonCost(buttonId) {
    const button = document.getElementById(buttonId);

    if (!button) {
        return;
    }

    const cost = button.querySelector(".costButton_cost");

    if (!cost) {
        return;
    }

    cost.classList.remove("costInsufficientFlash");
    void cost.offsetWidth;
    cost.classList.add("costInsufficientFlash");

    setTimeout(() => {
        cost.classList.remove("costInsufficientFlash");
    }, 650);
}

export function updateCurseVignette() {
    if (gameVariables.progression.triggers.bleedingStemmed) {
        document.documentElement.style.setProperty(
            "--curse-vignette-strength",
            "0"
        );
        return;
    }

    let revealedCurses = 0;

    for (const curseId of SELF_EXAMINATION_CURSE_IDS) {
        const definition = STATUS_EFFECT_DEFINITIONS[curseId];

        if (gameVariables.status[definition.revealStatusKey]) {
            revealedCurses += 1;
        }
    }

    const strength = Math.min(0.6, revealedCurses * 0.12);
    document.documentElement.style.setProperty(
        "--curse-vignette-strength",
        strength.toFixed(2)
    );
}

export function updateButtonsDisplay() {
    const condenseEssenceButton = document.getElementById("btn_condenseEssence");
    const examineSelfButton = document.getElementById("btn_examineSelf");
    const stemBleedingButton = document.getElementById("btn_stemBleeding");

    if (condenseEssenceButton) {
        condenseEssenceButton.classList.toggle(
            "_visible",
            gameVariables.unlocks.essenceCondensation
        );
    }

    if (examineSelfButton) {
        examineSelfButton.classList.toggle(
            "_visible",
            gameVariables.unlocks.purge &&
            !gameVariables.progression.triggers.selfExamined
        );
    }

    if (stemBleedingButton) {
        stemBleedingButton.classList.toggle(
            "_visible",
            gameVariables.status.bleedingRevealed &&
            !gameVariables.progression.triggers.bleedingStemmed
        );
    }
}

export function updateTabsDisplay() {
    const coreTabButton = document.getElementById("tabButton_core");
    const purgeTabButton = document.getElementById("tabButton_purge");

    if (coreTabButton) {
        coreTabButton.classList.toggle("_visible", gameVariables.unlocks.purge);
    }

    if (purgeTabButton) {
        purgeTabButton.classList.toggle("_visible", gameVariables.unlocks.purge);
    }
}
