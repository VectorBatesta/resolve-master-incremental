import { gameVariables } from "./state.js";

export function fixMaxAll() {
    for (const resource of Object.values(gameVariables.resources)) {
        if (resource.amount > resource.max) {
            resource.amount = resource.max;
        }
    }
}
