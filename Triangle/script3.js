function showError(message) {
    console.error(message);  // Logs the error to the console
    alert(message);          // Optionally shows an alert with the error message
}

function triangle() {
    const canvas = document.getElementById('demo-canvas');
    if (!canvas) {
        showError('Cannot get the canvas');
        return;
    }
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        showError('This browser does not support WebGL2');
        return;
    }

    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    const TriangleVertices = [
        0.0,  0.5,  1.0, 0.0, 0.0,  // Top vertex, red
       -0.5, -0.5,  0.0, 1.0, 0.0,  // Bottom-left vertex, green
        0.5, -0.5,  0.0, 0.0, 1.0   // Bottom-right vertex, blue
    ];
    
    const TriangleVerticesBuffer = new Float32Array(TriangleVertices);
    const TriangleBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, TriangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, TriangleVerticesBuffer, gl.STATIC_DRAW);

    const vertexShaderSourceCode = `#version 300 es
    precision mediump float;
    
    in vec2 vertexPosition;
    in vec3 vertexColor;  // Color attribute

    out vec3 fragColor;  // Pass color to the fragment shader

    void main() {
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
        fragColor = vertexColor;
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSourceCode);
    gl.compileShader(vertexShader);

    const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;
    
    in vec3 fragColor;   // Color from the vertex shader
    out vec4 outputColor;
    
    void main() {
        outputColor = vec4(fragColor, 1.0);  // Use the interpolated color for the gradient
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    const triangleShaderProgram = gl.createProgram();
    gl.attachShader(triangleShaderProgram, vertexShader);
    gl.attachShader(triangleShaderProgram, fragmentShader);
    gl.linkProgram(triangleShaderProgram);

    const vertexPositionLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');
    const vertexColorLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexColor');

    gl.useProgram(triangleShaderProgram);

    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);

    gl.enableVertexAttribArray(vertexColorLocation);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

try {
    triangle();
} catch (e) {
    showError(`Uncaught JavaScript error: ${e}`);
}
