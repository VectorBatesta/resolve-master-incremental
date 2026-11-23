export const RESOURCE_DEFINITIONS = {
    essence: {
        label: "Essence",
        defaultAmount: 0,
        defaultMax: 10,
        decimals: 2,
        absorption: {
            baseGain: 0.15,
            hindrancePivot: 4.8,
            hindranceCurvePower: 12
        },
        condensation: {
            cost: 5,
            output: 0.5,
            guaranteedUntil: 1
        }
    },
    condensedEssence: {
        label: "Condensed Essence",
        defaultAmount: 0,
        defaultMax: 10,
        decimals: 2
    }
};
