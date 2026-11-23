import {
    SAVE_VERSION,
    createNewSave,
    gameVariables,
    setGameVariables
} from "../game/state.js";

const SAVE_KEY = "saveStorage";
const AUTOSAVE_INTERVAL_MS = 5000;

function migrateResource(resource, fallbackResource = { amount: 0, max: 0 }) {
    if (Array.isArray(resource)) {
        return {
            amount: Number(resource[0]) || 0,
            max: Number(resource[1]) || fallbackResource.max
        };
    }

    if (resource && typeof resource === "object") {
        return {
            amount: Number(resource.amount) || 0,
            max: Number(resource.max) || fallbackResource.max
        };
    }

    return {
        amount: fallbackResource.amount,
        max: fallbackResource.max
    };
}

export function migrateSave(save) {
    const defaults = createNewSave();

    if (!save || typeof save !== "object") {
        return defaults;
    }

    const savedModifiers = {
        ...(save.modifiers || {})
    };

    if (
        savedModifiers.essenceHindrance === undefined &&
        savedModifiers.focusHindrance !== undefined
    ) {
        savedModifiers.essenceHindrance = savedModifiers.focusHindrance;
    }

    delete savedModifiers.focusHindrance;

    const migratedSave = {
        ...defaults,
        ...save,
        version: SAVE_VERSION,
        status: {
            ...defaults.status,
            ...(save.status || {})
        },
        unlocks: {
            ...defaults.unlocks,
            ...(save.unlocks || {})
        },
        progression: {
            ...defaults.progression,
            ...(save.progression || {}),
            triggers: {
                ...defaults.progression.triggers,
                ...(save.progression?.triggers || {})
            },
            stats: {
                ...defaults.progression.stats,
                ...(save.progression?.stats || {})
            }
        },
        exploration: {
            ...defaults.exploration,
            ...(save.exploration || {})
        },
        modifiers: {
            ...defaults.modifiers,
            ...savedModifiers
        },
        resources: {}
    };

    for (const [resourceId, defaultResource] of Object.entries(defaults.resources)) {
        migratedSave.resources[resourceId] = migrateResource(
            save.resources?.[resourceId],
            defaultResource
        );
    }

    for (const [resourceId, savedResource] of Object.entries(save.resources || {})) {
        if (!(resourceId in migratedSave.resources)) {
            migratedSave.resources[resourceId] = migrateResource(savedResource);
        }
    }

    return migratedSave;
}

export function loadGame() {
    const storedSave = localStorage.getItem(SAVE_KEY);

    if (!storedSave) {
        setGameVariables(createNewSave());
        return;
    }

    try {
        setGameVariables(migrateSave(JSON.parse(storedSave)));
    }
    catch (error) {
        console.error("Could not load save:", error);
        setGameVariables(createNewSave());
    }
}

export function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameVariables));
}

export function saveWipe() {
    setGameVariables(createNewSave());
    saveGame();
    location.reload();
}

export function startAutosave() {
    return setInterval(saveGame, AUTOSAVE_INTERVAL_MS);
}
