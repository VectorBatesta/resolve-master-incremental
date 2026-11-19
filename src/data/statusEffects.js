export const STATUS_EFFECT_DEFINITIONS = {
    essenceHindrance: {
        imageName: "placeholder.png",
        title: "Essence Accumulation Hindrance",
        description: "Something is resisting your attempts to accumulate essence.",
        amountLines: 1,
        curse: true,
        isVisible(gameVariables) {
            return gameVariables.status.essenceHindranceRevealed;
        },
        getDetailTexts(gameVariables) {
            return [
                "Curse Power: " + gameVariables.modifiers.essenceHindrance
            ];
        }
    }
};
