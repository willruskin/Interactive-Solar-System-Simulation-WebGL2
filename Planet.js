"use strict";

class Planet {
    constructor(gl, shaderProgram, options) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.scale = options.scale;
        this.dayPeriod = options.dayPeriod;
        this.yearPeriod = options.yearPeriod;
        this.orbitDistance = options.orbitDistance;
        this.axisTilt = options.axisTilt;
        this.orbitTilt = options.orbitTilt;

        this.dayAngle = 0;
        this.yearAngle = 0;
        this.moons = [];

        // Create a Vertex Array Object
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // Create and load vertex positions
        this.vertices = this.createScaledCubeVertices(this.scale);
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
        gl.vertexAttribPointer(this.vPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vPosition);

        // Create and load color buffer
        this.colors = this.createCubeColors();
        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

        this.vColor = gl.getAttribLocation(shaderProgram, "vColor");
        gl.vertexAttribPointer(this.vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.vColor);

        gl.bindVertexArray(null);
    }

    attachMoon(moon) {
        this.moons.push(moon);
    }

    update() {
        this.dayAngle = (this.dayAngle + this.dayPeriod) % 360;
        this.yearAngle = (this.yearAngle + this.yearPeriod) % 360;

        for (let moon of this.moons) {
            moon.update();
        }
    }

    render(viewMatrix, projectionMatrix, parentMatrix = mat4()) {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);

        let modelMatrix = mat4();
        modelMatrix = mult(modelMatrix, rotate(this.orbitTilt, [0, 0, 1]));
        modelMatrix = mult(modelMatrix, rotate(this.yearAngle, [0, 1, 0]));
        modelMatrix = mult(modelMatrix, translate(this.orbitDistance, 0, 0));
        
        modelMatrix = mult(modelMatrix, rotate(this.axisTilt, [0, 0, 1]));
        modelMatrix = mult(modelMatrix, rotate(this.dayAngle, [0, 1, 0]));

        modelMatrix = mult(parentMatrix, modelMatrix);

        gl.bindVertexArray(this.vao);

        const modelLoc = gl.getUniformLocation(this.shaderProgram, "modelMat");
        const viewLoc = gl.getUniformLocation(this.shaderProgram, "viewMat");
        const projLoc = gl.getUniformLocation(this.shaderProgram, "projectionMat");

        gl.uniformMatrix4fv(modelLoc, false, flatten(modelMatrix));
        gl.uniformMatrix4fv(viewLoc, false, flatten(viewMatrix));
        gl.uniformMatrix4fv(projLoc, false, flatten(projectionMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);

        for (let moon of this.moons) {
            moon.render(viewMatrix, projectionMatrix, modelMatrix);
        }

        gl.bindVertexArray(null);
    }

    createScaledCubeVertices(scale) {
        const s = scale / 2;
        return [
            -s,-s,-s,  s,-s,-s,  s, s,-s,
            -s,-s,-s,  s, s,-s, -s, s,-s,
            -s,-s, s,  s,-s, s,  s, s, s,
            -s,-s, s,  s, s, s, -s, s, s,
            -s,-s,-s, -s, s,-s, -s, s, s,
            -s,-s,-s, -s, s, s, -s,-s, s,
             s,-s,-s,  s, s,-s,  s, s, s,
             s,-s,-s,  s, s, s,  s,-s, s,
            -s,-s,-s, -s,-s, s,  s,-s, s,
            -s,-s,-s,  s,-s, s,  s,-s,-s,
            -s, s,-s, -s, s, s,  s, s, s,
            -s, s,-s,  s, s, s,  s, s,-s
        ];
    }

    createCubeColors() {
        const faceColors = [
            [1, 0, 0], [0, 1, 0], [0, 0, 1],
            [1, 1, 0], [0, 1, 1], [1, 0, 1]
        ];
        const colors = [];
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                colors.push(...faceColors[i]);
            }
        }
        return colors;
    }
}
