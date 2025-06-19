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

    // document.getElementById(`bgm`).load();
    // document.getElementById(`bgm`).oncanplaythrough = () => {
    //     const bgmDuration = {
    //         minutes: parseInt(document.getElementById(`bgm`).duration / 60).toString().padStart(2, `0`),
    //         seconds: parseInt(document.getElementById(`bgm`).duration % 60).toString().padStart(2, `0`),
    //         milliseconds: (document.getElementById(`bgm`).duration % 1).toFixed(3).split(`.`)[1]
    //         // milliseconds: 0
    //     }
    //     document.getElementById(`bgm`).duration;

    //     document.getElementById(`audioTimer`).innerHTML = ` / ${bgmDuration.minutes}:${bgmDuration.seconds}:${bgmDuration.milliseconds}`;
    // }
    if (location.href.includes(`battle1`)) {
        await loadScript(`scripts/battle1.js`);
    }
}