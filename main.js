

function Main() {
    const canvas = document.getElementById("gl-canvas");
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    const gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL2 not supported by your browser.");
        return;
    }

    const shaderProgram = initShaders(gl, "vShader.glsl", "fShader.glsl");
    const solar = new Solar(gl, shaderProgram);

    const playPauseButton = document.getElementById("playPauseButton");
    if (playPauseButton) {
        playPauseButton.onclick = () => {
            solar.togglePlay();
            playPauseButton.textContent = solar.isPlaying ? "Pause" : "Play";
        };
    }

    function loop() {
        solar.update();
        solar.render();
        requestAnimationFrame(loop);
    }

    loop();
}

window.addEventListener("DOMContentLoaded", Main);

