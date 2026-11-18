import { RESOURCE_DEFINITIONS } from "../data/resources.js";
import { STATUS_EFFECT_DEFINITIONS } from "../data/statusEffects.js";
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
        const definition = STATUS_EFFECT_DEFINITIONS[status.id];

        if (!definition) {
            continue;
        }

        const buffTexts = definition.getBuffTexts(gameVariables);
        const buffElements = status.getElementsByClassName("effect_buff_text");

        for (let i = 0; i < buffElements.length; i++) {
            buffElements[i].textContent = buffTexts[i] || "";
        }
    }
}
