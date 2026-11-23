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

export function newButton(IDname, texto, funcao, parentId = "tab1_divEsq") {
    const newDiv = document.createElement("div");
    newDiv.id = IDname;
    newDiv.className = "interactableButton";

    if (funcao) {
        newDiv.addEventListener("click", funcao);
    }

    newDiv.textContent = texto;

    document.getElementById(parentId).appendChild(newDiv);

    return newDiv;
}

export function newCostButton(IDname, costText, actionText, funcao, parentId) {
    const newDiv = document.createElement("div");
    newDiv.id = IDname;
    newDiv.className = "interactableButton costButton";

    if (funcao) {
        newDiv.addEventListener("click", funcao);
    }

    const cost = document.createElement("span");
    cost.className = "costButton_cost";
    cost.textContent = costText;

    const action = document.createElement("span");
    action.className = "costButton_action";
    action.textContent = actionText;

    newDiv.appendChild(cost);
    newDiv.appendChild(action);

    document.getElementById(parentId).appendChild(newDiv);

    return newDiv;
}

export function newHoldableButton(IDname, texto, funcao, intervalTime, parentId = "tab1_divEsq") {
    const newDiv = document.createElement("div");
    newDiv.id = IDname;
    newDiv.className = "interactableButton";
    newDiv.textContent = texto;
    newDiv.style.touchAction = "none";

    let intervalId;

    function onHold(event) {
        if (!intervalId) {
            newDiv.setPointerCapture(event.pointerId);

            // Short taps intentionally do nothing. The action begins only after
            // the player has held the button for the configured interval.
            intervalId = setInterval(funcao, intervalTime);
        }
    }

    function onRelease(event) {
        clearInterval(intervalId);
        intervalId = null;

        if (newDiv.hasPointerCapture(event.pointerId)) {
            newDiv.releasePointerCapture(event.pointerId);
        }
    }

    newDiv.addEventListener("pointerdown", onHold);
    newDiv.addEventListener("pointerup", onRelease);
    newDiv.addEventListener("pointercancel", onRelease);

    document.getElementById(parentId).appendChild(newDiv);

    return newDiv;
}

export function newTabButton(IDname, texto, tabNumber, funcao) {
    const newDiv = document.createElement("div");
    newDiv.id = IDname;
    newDiv.className = "tabButton";
    newDiv.dataset.tabNumber = tabNumber;
    newDiv.textContent = texto;
    newDiv.addEventListener("click", funcao);

    document.getElementById("topMenu").appendChild(newDiv);

    return newDiv;
}

export function newStatusEffect(
    effectId,
    imageName,
    title,
    descr,
    amountLines,
    curse = false,
    purgeOnly = false,
    critical = false
) {
    const statusLists = document.getElementsByClassName("statusList");

    for (const statusList of statusLists) {
        const isPurgeList = statusList.classList.contains("purgeStatusList");

        if (isPurgeList && !curse) {
            continue;
        }

        if (!isPurgeList && purgeOnly) {
            continue;
        }

        const effect = document.createElement("div");
        effect.dataset.effectId = effectId;
        effect.className = "status";

        if (curse === true) {
            effect.classList.add("debuff");
        }

        if (critical === true) {
            effect.classList.add("criticalCurse");
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

    for (const tabButton of document.getElementsByClassName("tabButton")) {
        tabButton.classList.toggle(
            "_selected",
            Number(tabButton.dataset.tabNumber) === tabNumber
        );
    }
}
