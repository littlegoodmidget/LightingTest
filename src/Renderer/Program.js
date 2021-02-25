class Program {
    /**
     * 
     * @param {WebGLRenderingContext} gl 
     */
    constructor(gl, vshaderSource, fshaderSource) {
        console.log('Program Start');
        this.gl = gl;

        this.program = gl.createProgram();
        this.vshader = gl.createShader(gl.VERTEX_SHADER);
        this.fshader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.vshader, vshaderSource);
        gl.shaderSource(this.fshader, fshaderSource);
        gl.compileShader(this.vshader);
        gl.compileShader(this.fshader);
        gl.attachShader(this.program, this.vshader);
        gl.attachShader(this.program, this.fshader);
        gl.linkProgram(this.program);

        console.log('vert:', gl.getShaderInfoLog(this.vshader)? gl.getShaderInfoLog(this.vshader): 'Vertex shader all good!');
        console.log('frag:', gl.getShaderInfoLog(this.fshader)? gl.getShaderInfoLog(this.fshader): 'Fragment shader all good!');
        console.log('prog:', gl.getProgramInfoLog(this.program)? gl.getProgramInfoLog(this.program): 'Program all good!');
        

        let offsetSum = 0;
        this.offsets = [0];
        


        this.attribLocs = {};
        for(let i = 0; i < gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES); i++) {
            const attribInfo = gl.getActiveAttrib(this.program, i);
            console.log(attribInfo);

            switch (attribInfo.type) {
                case gl.FLOAT_VEC2:
                    offsetSum += 8;
                    break;
                case gl.FLOAT_VEC3:
                    offsetSum += 12;
                    break;
            }

            this.offsets.push(offsetSum);

            this.attribLocs[attribInfo.name] = i;
        }

        console.log('');

        this.uniformLocs = {};
        for(let i = 0; i < gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS); i++) {
            const uniformInfo = gl.getActiveUniform(this.program, i);
            console.log(uniformInfo);

            this.uniformLocs[uniformInfo.name] = gl.getUniformLocation(this.program, uniformInfo.name);
        }
        
        this.buffers = {};
        this.buffer = gl.createBuffer();
        this.buffers['default'] = this.buffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.enableAttribs();
        this.setupAttribPointers();
        
        this.info();
        // Unbind Array
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
        console.log('Program End');
    }
    enableAttribs() {
        let keys = Object.keys(this.attribLocs);

        for(let i = 0; i < keys.length; i++) {
            this.gl.enableVertexAttribArray(this.attribLocs[keys[i]]);
        }
    }
    setupAttribPointers() {
        let keys = Object.keys(this.attribLocs);
    
        for(let i = 0; i < keys.length; i++) {
            this.gl.vertexAttribPointer(this.attribLocs[keys[i]], (this.offsets[i + 1] - this.offsets[i]) / 4, this.gl.FLOAT, false, this.offsets[this.offsets.length - 1], this.offsets[i]);
        }
    }
    info() {
        let keys = Object.keys(this.attribLocs);

        console.log('vertex positions are in order of:')
        for(let i = 0; i < keys.length; i++) {
            console.log(`   ${i}:`, keys[i]);
            console.log(`       size:`, (this.offsets[i + 1] - this.offsets[i]) / 4);
        }
    }
    bindBuffer() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    }
    useProgram() {
        this.gl.useProgram(this.program);
    }
}