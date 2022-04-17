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
    if (location.href.includes(`battle1`)) {
        await loadScript(`scripts/battle1.js`);
    }
}