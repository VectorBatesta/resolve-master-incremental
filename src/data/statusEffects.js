export const STATUS_EFFECT_DEFINITIONS = {
    focusHindrance: {
        imageName: "placeholder.png",
        title: "Focus Hindrance",
        description: "Your focus is being obstructed by something.",
        amountBuffs: 2,
        curse: true,
        getBuffTexts(gameVariables) {
            return [
                "(buff0) Focus interference: " + gameVariables.modifiers.focusHindrance,
                "(buff1) Focus interference: " + gameVariables.resources.essence.amount.toFixed(2)
            ];
        }
    }
};
