class Renderer {
    /**
     * 
     * @param {canvas} canvas 
     */
    constructor(canvas) {
        let gl = canvas.getContext('webgl');
        this.gl = gl;
        this.programs = {};
        this.framebuffers = {
            default: null
        };

        this.currentProgram = undefined;
        this.currentFramebuffer = null;
        

        this.vertices = [];
    }
    createFramebuffer(name, fbWidth, fbHeight) {
        if (this.framebuffers[name] || name === 'default') throw new Error('Framebuffer name already in use!');
        
        const fb = this.gl.createFramebuffer();
        const tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, fbWidth, fbHeight, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        const renderbuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, fbWidth, fbHeight);

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, tex, 0);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);
        fb.texture = tex;

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);

        this.framebuffers[name] = fb;
    }
    clearFramebuffer() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    bindFramebufferTexture(name, textureSlot) {
        if (!this.framebuffers[name]) {
            if (name === 'defult') throw new Error('No default Framebuffer Texture!');
            else throw new Error('Unknown Framebuffer name');
        }
        this.gl.activeTexture(this.gl.TEXTURE0 + textureSlot);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.framebuffers[name].texture);
    }
    bindFramebuffer(name) {
        if (!this.framebuffers[name] && name != 'default') throw new Error('Unknown Framebuffer Name!');
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffers[name]);
        this.currentFramebuffer = this.framebuffers[name];
    }
    useProgram(name) {
        if (!this.programs[name]) throw new Error('Unknown Program Name!');
        this.gl.useProgram(this.programs[name].program);
        this.currentProgram = this.programs[name];

        // bind to the default buffer of program?
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.currentProgram.buffer);
        this.currentProgram.setupAttribPointers();
    }
    addProgram(name, vshaderSource, fshaderSource) {
        if (this.programs[name]) throw new Error('Framebuffer name already in use!');

        this.programs[name] = new Program(this.gl, vshaderSource, fshaderSource);
    }
    setUniform2f(name, ...args) {
        let uniformLoc = this.currentProgram.uniformLocs[name];
        this.gl.uniform2f(uniformLoc, ...args);
    }
    setUniform1f(name, ...args) {
        let uniformLoc = this.currentProgram.uniformLocs[name];
        this.gl.uniform1f(uniformLoc, ...args);
    }
    setUniform1i(name, ...args) {
        if (!this.currentProgram.uniformLocs[name]) throw new Error('Unknown Uniform!');
        let uniformLoc = this.currentProgram.uniformLocs[name];
        this.gl.uniform1i(uniformLoc, ...args);
    }
    clearVertices() {
        this.vertices.length = 0;
    }
    uploadVertices(...vertices) {
        // Slow to use ... syntax
        this.vertices.push(...vertices);
    }
    uploadBufferData() {
        // this.gl.enableVertexAttribArray(0);
        // this.currentProgram.enableAttribs();
        // this.currentProgram.setupAttribPointers();
        // this.gl.vertexAttribPointer(this.currentProgram.attribLocs['a_position'], 2, gl.FLOAT, false, 8, 0);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);

        // Prevents reuse of vertices which is probably wanted later
        this.clearVertices();
    }
    // DrawImage(texture, x, y, w, h);
    drawImage() {

    }
    draw() {
        let numVertices = this.vertices.length;
        this.uploadBufferData();
        // console.log(numVertices * 4));
        // console.log(numVertices);
        // console.log(this.currentProgram.offsets)
        // console.log(numVertices/(this.currentProgram.offsets[this.currentProgram.offsets.length - 1] / 4))
        this.gl.drawArrays(this.gl.TRIANGLES, 0, numVertices/(this.currentProgram.offsets[this.currentProgram.offsets.length - 1] / 4));
    }
}