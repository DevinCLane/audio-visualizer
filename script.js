const button = document.getElementById("play");
button.addEventListener("click", playSound);

const audioCtx = new AudioContext();

function playSound() {
    const oscillator = audioCtx.createOscillator();
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 500);
}
