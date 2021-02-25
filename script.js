const canvas = document.createElement('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;
document.body.appendChild(canvas);
const gl = canvas.getContext('webgl');
gl.enable(gl.BLEND);
// gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
// gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

// gl.clearColor(0, 0, 0, 1);
gl.clearColor(0.4, 0.4, 0.4, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

const drawShaderV = `
attribute vec2 a_position;
attribute vec3 a_color;
attribute vec2 a_uvcoords;

varying vec3 v_color;
varying vec2 v_uvcoords;

uniform vec2 u_resolution;
uniform vec2 u_offset;

void main()
{
    v_uvcoords = a_uvcoords;
    v_color = a_color;
    
    vec2 clipPos = (a_position + u_offset + u_resolution / 2.0) / u_resolution * 2.0 - 1.0;

    gl_Position = vec4(clipPos.x, -clipPos.y, 0.0, 1.0);
}
`;
const drawShaderF = `
precision mediump float;

varying vec3 v_color;
varying vec2 v_uvcoords;

uniform sampler2D u_tex;

void main()
{
    gl_FragColor = texture2D(u_tex, v_uvcoords) * vec4(v_color, 1.0);
}
`;
const multiplyTexV = `
attribute vec2 a_position;
attribute vec2 a_uvcoords1;
attribute vec2 a_uvcoords2;

varying vec2 v_uvcoords1;
varying vec2 v_uvcoords2;

uniform vec2 u_resolution;
uniform vec2 u_offset;

void main()
{
    v_uvcoords1 = a_uvcoords1;
    v_uvcoords2 = a_uvcoords2;

    vec2 clipPos = (a_position + u_offset + u_resolution / 2.0) / u_resolution * 2.0 - 1.0;
    
    gl_Position = vec4(clipPos.x, -clipPos.y, 0.0, 1.0);
}
`;
const multiplyTexF = `
precision mediump float;

varying vec2 v_uvcoords1;
varying vec2 v_uvcoords2;

uniform sampler2D u_tex1;
uniform sampler2D u_tex2;

void main()
{
    gl_FragColor = texture2D(u_tex1, v_uvcoords1) * texture2D(u_tex2, v_uvcoords2);
}
`;

const INPUT = {
    w: false,
    s: false,
    d: false,
    a: false,
    keyUpdate(e) {
        let down = e.type === 'keydown';

        switch (e.code) {
            case 'KeyW':
                this.w = down;
                break;
            case 'KeyS':
                this.s = down;
                break;
            case 'KeyD':
                this.d = down;
                break;
            case 'KeyA':
                this.a = down;
                break;
        }
    }
}


const defaultTexture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, defaultTexture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

const renderer = new Renderer(canvas);
const game = new Game(INPUT, renderer);

renderer.addProgram('main', drawShaderV, drawShaderF);
renderer.addProgram('textureMultiply', multiplyTexV, multiplyTexF);



renderer.createFramebuffer('1x1_lighting', ~~(game.viewport.BIVX+2), ~~(game.viewport.BIVY+2));

renderer.createFramebuffer('8x8_tiles1', ~~(game.viewport.BIVX+2) * 8, ~~(game.viewport.BIVY+2) * 8);
renderer.createFramebuffer('8x8_tiles2', ~~(game.viewport.BIVX+2) * 8, ~~(game.viewport.BIVY+2) * 8);


// renderer.bindFramebuffer('default');
// renderer.useProgram('main');
// renderer.setUniform2f('u_offset', -game.viewport.x * 8, -game.viewport.y * 8);
// renderer.setUniform2f('u_resolution', 256, 23 * 8);
// renderer.gl.viewport(0, 0, 256, 23 * 8);
// game.draw();
// renderer.uploadVertices(
//     0, -10, 1.0, 1.0, 1.0, 0.0, 0.0,
//     0 + 16 * 8, -10, 1.0, 1.0, 1.0, 0.0, 0.0,
//     0 + 16 * 8, 0, 1.0, 1.0, 1.0, 0.0, 0.0,
//     0, -10, 1.0, 1.0, 1.0, 0.0, 0.0,
//     0 + 16 * 8, 0, 1.0, 1.0, 1.0, 0.0, 0.0,
//     0, 0, 1.0, 1.0, 1.0, 0.0, 0.0,
// );
// renderer.draw();



// 
// 
// 
// 



renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);


renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);

// renderer.bindFramebuffer('default');
renderer.bindFramebuffer('8x8_tiles1');
renderer.useProgram('main');
renderer.setUniform2f('u_resolution', ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.gl.viewport(0, 0, ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.setUniform2f('u_offset', -game.viewport.x * 8, -game.viewport.y * 8);
game.draw();


renderer.bindFramebuffer('default');
renderer.bindFramebufferTexture('8x8_tiles1', 0);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);
renderer.setUniform2f('u_offset', -canvas.width/2, -canvas.height/2);
renderer.setUniform2f('u_resolution', canvas.width, canvas.height);
renderer.gl.viewport(0, 0, canvas.width, canvas.height);
// renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
renderer.uploadVertices(
    0, 0, 1, 1, 1, 0, 1,
    canvas.width, 0, 1, 1, 1, 1, 1,
    canvas.width, canvas.height, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 0, 1,
    canvas.width, canvas.height, 1, 1, 1, 1, 0,
    0, canvas.height, 1, 1, 1, 0, 0,
);
renderer.draw();



renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);

renderer.bindFramebuffer('1x1_lighting');
renderer.useProgram('main');
renderer.setUniform2f('u_offset', -game.viewport.x, -game.viewport.y);
renderer.setUniform2f('u_resolution', ~~(game.viewport.BIVX+2), ~~(game.viewport.BIVY+2));
renderer.gl.viewport(0, 0, ~~(game.viewport.BIVX+2), ~~(game.viewport.BIVY+2));
game.viewport.drawLightSmall(renderer, game.lightmap);
renderer.draw();


renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);

renderer.bindFramebuffer('8x8_tiles2');
renderer.bindFramebufferTexture('1x1_lighting', 0);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.LINEAR);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);
renderer.setUniform2f('u_resolution', ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.gl.viewport(0, 0, ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.setUniform2f('u_offset', -~~(game.viewport.BIVX+2)*8/2, -~~(game.viewport.BIVY+2)*8/2);
// game.draw();
// renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
renderer.uploadVertices(
    0, 0, 1, 1, 1, 0, 1,
    ~~(game.viewport.BIVX+2)*8, 0, 1, 1, 1, 1, 1,
    ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 0, 1,
    ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8, 1, 1, 1, 1, 0,
    0, ~~(game.viewport.BIVY+2)*8, 1, 1, 1, 0, 0,
);
renderer.draw();



renderer.bindFramebuffer('default');
renderer.bindFramebufferTexture('1x1_lighting', 0);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);
renderer.setUniform2f('u_offset', -canvas.width/2, -canvas.height/2);
renderer.setUniform2f('u_resolution', canvas.width, canvas.height);
renderer.gl.viewport(0, 0, canvas.width, canvas.height);
// renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
renderer.uploadVertices(
    0, 0, 1, 1, 1, 0, 1,
    canvas.width, 0, 1, 1, 1, 1, 1,
    canvas.width, canvas.height, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 0, 1,
    canvas.width, canvas.height, 1, 1, 1, 1, 0,
    0, canvas.height, 1, 1, 1, 0, 0,
);
renderer.draw();




// renderer.useProgram('textureMultiply');
// renderer.bindFramebuffer('default');
// renderer.bindFramebufferTexture('8x8_tiles1', 0);
// renderer.bindFramebufferTexture('8x8_tiles2', 1);
// renderer.setUniform1i('u_tex1', 0);
// renderer.setUniform1i('u_tex2', 1);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);
// renderer.setUniform2f('u_offset', -canvas.width/2, -canvas.height/2);
// renderer.setUniform2f('u_resolution', canvas.width, canvas.height);
// renderer.gl.viewport(0, 0, canvas.width, canvas.height);
// // renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
// renderer.uploadVertices(
//     0, 0, 0, 1, 0, 1,
//     canvas.width, 0, 1, 1, 1, 1,
//     canvas.width, canvas.height, 1, 0, 1, 0,
//     0, 0,  0, 1, 0, 1,
//     canvas.width, canvas.height, 1, 0, 1, 0,
//     0, canvas.height, 0, 0, 0, 0,
// );
// renderer.draw();




function loop() {

    game.update();
    // game.draw();
        

renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);


renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);

// renderer.bindFramebuffer('default');
renderer.bindFramebuffer('8x8_tiles1');
renderer.useProgram('main');
renderer.setUniform2f('u_resolution', ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.gl.viewport(0, 0, ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.setUniform2f('u_offset', -game.viewport.x * 8, -game.viewport.y * 8);
renderer.clearFramebuffer();
game.draw();


// renderer.bindFramebuffer('default');
// renderer.bindFramebufferTexture('8x8_tiles1', 0);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);
// renderer.setUniform2f('u_offset', -canvas.width/2, -canvas.height/2);
// renderer.setUniform2f('u_resolution', canvas.width, canvas.height);
// renderer.gl.viewport(0, 0, canvas.width, canvas.height);
// // renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
// renderer.uploadVertices(
//     0, 0, 1, 1, 1, 0, 1,
//     canvas.width, 0, 1, 1, 1, 1, 1,
//     canvas.width, canvas.height, 1, 1, 1, 1, 0,
//     0, 0, 1, 1, 1, 0, 1,
//     canvas.width, canvas.height, 1, 1, 1, 1, 0,
//     0, canvas.height, 1, 1, 1, 0, 0,
// );
// renderer.clearFramebuffer();
// renderer.draw();



renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);

renderer.bindFramebuffer('1x1_lighting');
renderer.useProgram('main');
renderer.setUniform2f('u_offset', 0, 0);
// renderer.setUniform2f('u_offset', -game.viewport.x, -game.viewport.y);
renderer.setUniform2f('u_resolution', ~~(game.viewport.BIVX+2), ~~(game.viewport.BIVY+2));
renderer.gl.viewport(0, 0, ~~(game.viewport.BIVX+2), ~~(game.viewport.BIVY+2));
game.viewport.drawLightSmall(renderer, game.lightmap);
renderer.clearFramebuffer();
renderer.draw();


renderer.gl.activeTexture(renderer.gl.TEXTURE0);
renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);

renderer.bindFramebuffer('8x8_tiles2');
renderer.bindFramebufferTexture('1x1_lighting', 0);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.LINEAR);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);
renderer.setUniform2f('u_resolution', ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.gl.viewport(0, 0, ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8);
renderer.setUniform2f('u_offset', -~~(game.viewport.BIVX+2)*8/2 - (game.viewport.x*8)%8+4, -~~(game.viewport.BIVY+2)*8/2 - (game.viewport.y*8)%8 - 4);
// game.draw();
// renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
renderer.uploadVertices(
    0, 0, 1, 1, 1, 0, 1,
    ~~(game.viewport.BIVX+2)*8, 0, 1, 1, 1, 1, 1,
    ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 1, 0, 1,
    ~~(game.viewport.BIVX+2)*8, ~~(game.viewport.BIVY+2)*8, 1, 1, 1, 1, 0,
    0, ~~(game.viewport.BIVY+2)*8, 1, 1, 1, 0, 0,
);
renderer.clearFramebuffer();
renderer.draw();



// renderer.bindFramebuffer('default');
// renderer.bindFramebufferTexture('1x1_lighting', 0);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);
// renderer.setUniform2f('u_offset', -canvas.width/2, -canvas.height/2 - 16);
// renderer.setUniform2f('u_resolution', canvas.width, canvas.height);
// renderer.gl.viewport(0, 0, canvas.width, canvas.height);
// // renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
// renderer.uploadVertices(
//     0, 0, 1, 1, 1, 0, 1,
//     canvas.width, 0, 1, 1, 1, 1, 1,
//     canvas.width, canvas.height, 1, 1, 1, 1, 0,
//     0, 0, 1, 1, 1, 0, 1,
//     canvas.width, canvas.height, 1, 1, 1, 1, 0,
//     0, canvas.height, 1, 1, 1, 0, 0,
// );
// renderer.draw();




renderer.useProgram('textureMultiply');
renderer.bindFramebuffer('default');
renderer.bindFramebufferTexture('8x8_tiles1', 0);
// renderer.gl.activeTexture(renderer.gl.TEXTURE0);
// renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, defaultTexture);
renderer.bindFramebufferTexture('8x8_tiles2', 1);
// renderer.setUniform1i('u_tex1', 0);
renderer.setUniform1i('u_tex2', 1);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.LINEAR);
renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl.NEAREST);
// renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.NEAREST);
renderer.setUniform2f('u_offset', -canvas.width/2, -canvas.height/2);
renderer.setUniform2f('u_resolution', canvas.width, canvas.height);
renderer.gl.viewport(0, 0, canvas.width, canvas.height);
// renderer.setUniform2f('u_offset', -canvas.width/2-game.viewport.x * 8, -canvas.height/2-game.viewport.y * 8);
renderer.uploadVertices(
    0, 0, 0, 1, 0, 1,
    canvas.width, 0, 1, 1, 1, 1,
    canvas.width, canvas.height, 1, 0, 1, 0,
    0, 0,  0, 1, 0, 1,
    canvas.width, canvas.height, 1, 0, 1, 0,
    0, canvas.height, 0, 0, 0, 0,
);
renderer.clearFramebuffer();
renderer.draw();


    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);








window.addEventListener('keydown', function(e) {
    if (!e.repeat) INPUT.keyUpdate(e);
})
window.addEventListener('keyup', function(e) {
    INPUT.keyUpdate(e);
})