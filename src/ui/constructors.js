//////////////////////////////////////////////
// constructors macros ///////////////////////
//////////////////////////////////////////////

export function addLoreMessage(text, highlight = true) {
    const loreList = document.getElementById("loreList");
    const lore = document.createElement("li");
    lore.classList.add("lore");

    if (highlight) {
        lore.classList.add("newLore");
    }

    lore.textContent = text;
    loreList.appendChild(lore);

    return lore;
}

export function newButton(IDname, texto, funcao) {
    const newDiv = document.createElement("div");
    newDiv.id = IDname;
    newDiv.className = "interactableButton";
    newDiv.addEventListener("click", funcao);
    newDiv.textContent = texto;

    document.getElementById("tab1_divEsq").appendChild(newDiv);

    return newDiv;
}

export function newHoldableButton(IDname, texto, funcao, intervalTime) {
    const newDiv = document.createElement("div");
    newDiv.id = IDname;
    newDiv.className = "interactableButton";
    newDiv.textContent = texto;
    newDiv.style.touchAction = "none";

    let intervalId;

    function onHold() {
        if (!intervalId) {
            // Short taps intentionally do nothing. The action begins only after
            // the player has held the button for the configured interval.
            intervalId = setInterval(funcao, intervalTime);
        }
    }

    function onRelease() {
        clearInterval(intervalId);
        intervalId = null;
    }

    newDiv.addEventListener("pointerdown", onHold);
    newDiv.addEventListener("pointerup", onRelease);
    newDiv.addEventListener("pointerleave", onRelease);
    newDiv.addEventListener("pointercancel", onRelease);

    document.getElementById("tab1_divEsq").appendChild(newDiv);

    return newDiv;
}

export function newStatusEffect(effectId, imageName, title, descr, amountLines, curse = false) {
    const statusLists = document.getElementsByClassName("statusList");

    for (const statusList of statusLists) {
        const effect = document.createElement("div");
        effect.dataset.effectId = effectId;
        effect.className = "status";

        if (curse === true) {
            effect.classList.add("debuff");
        }

        const effectImage = document.createElement("img");
        effectImage.src = "imgs/" + imageName;
        effectImage.width = "60";
        effectImage.height = "60";

        const effectBlock = document.createElement("div");
        const effectDescrTitle = document.createElement("span");
        effectDescrTitle.textContent = title;

        const effectDescr = document.createElement("div");
        effectDescr.textContent = descr;

        const effectDetails = document.createElement("ul");

        for (let i = 0; i < amountLines; i++) {
            const newLi = document.createElement("li");
            newLi.className = "effect_detail_text";
            effectDetails.appendChild(newLi);
        }

        effectBlock.appendChild(effectDescrTitle);
        effectBlock.appendChild(effectDescr);
        effectBlock.appendChild(effectDetails);

        effect.appendChild(effectImage);
        effect.appendChild(effectBlock);

        statusList.appendChild(effect);
    }
}

export function screen(tabNumber) {
    for (const tab of document.getElementsByClassName("tab")) {
        tab.classList.remove("_visible");
    }

    document.getElementById("tab" + tabNumber).classList.add("_visible");
}
