async function loadScript(scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`Load ${scriptName}`)
        const scriptTag = document.createElement(`script`);
        scriptTag.src = scriptName;
        scriptTag.onload = resolve;
        scriptTag.onerror = reject;
        document.head.appendChild(scriptTag);

    })
}

window.onload = async () => {
    await loadScript(`../../commonFiles/scripts/common.js`);
    if (location.href.includes(`AristinaleVillage`)) {
        await loadScript(`scripts/AristinaleVillage.js`);
    }
    if (location.href.includes(`Tavern1`)) {
        await loadScript(`scripts/Tavern1.js`);
    }
}