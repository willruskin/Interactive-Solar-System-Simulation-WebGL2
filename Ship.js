class Ship {
    constructor(gl, shaderProgram) {
        this.gl = gl;
        this.shaderProgram = shaderProgram;

        this.position = vec3(0, 2, 10);
        this.angle = 0;

        this.vertices = [
            0, 0.2, 0,
           -0.1, 0, 0,
            0.1, 0, 0
        ];

        this.colors = [
            1, 1, 1,
            1, 1, 1,
            1, 1, 1
        ];

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    }

    moveForward(delta) {
        this.position[0] += delta * Math.sin(radians(this.angle));
        this.position[2] += delta * Math.cos(radians(this.angle));
    }

    moveSideways(delta) {
        this.position[0] += delta * Math.cos(radians(this.angle));
        this.position[2] -= delta * Math.sin(radians(this.angle));
    }

    moveUp(delta) {
        this.position[1] += delta;
    }

    rotate(theta) {
        this.angle += theta;
    }

   getViewMatrix() {
    let eye = vec3(0, 2, 10);

    let forward = vec3(
        Math.sin(radians(this.angle)),
        0,
        Math.cos(radians(this.angle))
    );
    let center = add(eye, forward);
    let up = vec3(0, 1, 0);

    return lookAt(eye, center, up);
}  


    render(viewMatrix, projectionMatrix) {
    const gl = this.gl;
    gl.useProgram(this.shaderProgram);
    let modelMatrix = mat4();
    translate(modelMatrix, modelMatrix, this.position);
    rotateY(modelMatrix, modelMatrix, radians(this.angle));

    //transformMat should have all the umodel, view, and projection matrices

    let transformMat = mult(projectionMatrix, mult(viewMatrix, modelMatrix));

    let transformLoc = gl.getUniformLocation(this.shaderProgram, "transform");
    gl.uniformMatrix4fv(transformLoc, false, flatten(transformMat));


    // Use vPosition from vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    let vPosition = gl.getAttribLocation(this.shaderProgram, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Use vColor from vertex shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    let vColor = gl.getAttribLocation(this.shaderProgram, "vColor");
    gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
}

}
