function Solar(gl, shaderProgram) {
    this.gl = gl;
    this.shaderProgram = shaderProgram;
    this.isPlaying = true;

    this.sun = new Planet(gl, shaderProgram, {
        scale: 1,
        dayPeriod: 0.2,
        yearPeriod: 0,
        orbitDistance: 0,
        axisTilt: 0,
        orbitTilt: 0
    });

    const mercury = new Planet(gl, shaderProgram, {
        scale: 0.3,
        dayPeriod: 0.6,
        yearPeriod: 2,
        orbitDistance: 3,
        axisTilt: 0,
        orbitTilt: 0
    });

    this.sun.attachMoon(mercury);

    this.ship = new Ship(gl, shaderProgram);
    this.bindKeys();
}

Solar.prototype.bindKeys = function () {
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case 'z':
                console.log("Key 'z' pressed: moveForward(-0.2)");
                this.ship.moveForward(-0.2);
                break;
            case 'x':
                console.log("Key 'x' pressed: moveBack(0.2)");
                this.ship.moveForward(0.2);
                break;
            case 'a':
                console.log("Key 'a' pressed: moveLeft(-0.2)");
                this.ship.moveSideways(-0.2);
                break;
            case 'd':
                console.log("Key 'd' pressed: moveRight(0.2)");
                this.ship.moveSideways(0.2);
                break;
            case 'w':
                console.log("Key 'w' pressed: moveUp(0.2)");
                this.ship.moveUp(0.2);
                break;
            case 's':
                console.log("Key 's' pressed: moveDown(-0.2)");
                this.ship.moveUp(-0.2);
                break;
            case 'q':
                console.log("Key 'q' pressed: rotate(-5)");
                this.ship.rotate(-5);
                break;
            case 'e':
                console.log("Key 'e' pressed: rotate(5)");
                this.ship.rotate(5);
                break;
        }
        // Log updated ship position & angle on every key press
        console.log("Ship position:", this.ship.position, "Angle:", this.ship.angle);
    });
};

Solar.prototype.togglePlay = function () {
    this.isPlaying = !this.isPlaying;
    console.log("Play toggled. Now playing?", this.isPlaying);
};

Solar.prototype.update = function () {
    if (this.isPlaying) {
        this.sun.update();
    }
};

Solar.prototype.render = function () {
    const gl = this.gl;
    gl.useProgram(this.shaderProgram);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    const proj = mat4();
    perspective(proj, radians(60), gl.canvas.width / gl.canvas.height, 0.1, 100);

    const view = this.ship.getViewMatrix();
    console.log("View Matrix:", view);

    this.sun.render(view, proj);
    this.ship.render(view, proj);
};