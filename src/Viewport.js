class Viewport {
    constructor(width, height) {
        this.BS = 32;
        this.BIVX = width / this.BS+1;
        this.BIVY = height / this.BS+1;

        this.x = 0;
        this.y = 0;
        // this.x = 22;
        // this.y = 15;
    }
    update(INPUT) {
        this.x += (INPUT.d - INPUT.a) / 10;
        this.y += (INPUT.s - INPUT.w) / 10;

        renderer.setUniform2f('u_offset', -this.x * this.BS, -this.y * this.BS);
    }
    draw(renderer, map) {
        for(let i = ~~(-this.BIVY/2 + this.y); i < this.BIVY/2 + this.y; i++) {
            for(let j = ~~(-this.BIVX/2 + this.x); j < this.BIVX/2 + this.x; j++) {
                if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) continue;

                if (map[~~(i)][~~(j)] === 1) renderer.uploadVertices(
                    j * this.BS, i * this.BS, 0.4, 0.4, 0.7, 1, 1,
                    (j + 1) * this.BS, i * this.BS, 0.4, 0.4, 0.7, 1, 1,
                    (j + 1) * this.BS, (i + 1) * this.BS, 0.4, 0.4, 0.7, 1, 1,
                    j * this.BS, i * this.BS, 0.4, 0.4, 0.7, 1, 1,
                    (j + 1) * this.BS, (i + 1) * this.BS, 0.4, 0.4, 0.7, 1, 1,
                    j * this.BS, (i + 1) * this.BS, 0.4, 0.4, 0.7, 1, 1,
                )   
                else if (map[~~(i)][~~(j)] === 2) renderer.uploadVertices(
                    j * this.BS, i * this.BS, 0.7, 0.5, 0.4, 1, 1,
                    (j + 1) * this.BS, i * this.BS, 0.7, 0.5, 0.4, 1, 1,
                    (j + 1) * this.BS, (i + 1) * this.BS, 0.7, 0.5, 0.4, 1, 1,
                    j * this.BS, i * this.BS, 0.7, 0.5, 0.4, 1, 1,
                    (j + 1) * this.BS, (i + 1) * this.BS, 0.7, 0.5, 0.4, 1, 1,
                    j * this.BS, (i + 1) * this.BS, 0.7, 0.5, 0.4, 1, 1,
                )
            }
        }
    }
    drawSmall(renderer, map) {
        for(let i = ~~(-this.BIVY/2 + this.y) - 1; i <= this.BIVY/2 + this.y + 1; i++) {
            for(let j = ~~(-this.BIVX/2 + this.x) - 1; j <= this.BIVX/2 + this.x + 1; j++) {
                if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) continue;

                if (map[~~(i)][~~(j)] === 1) renderer.uploadVertices(
                    j * 8, i * 8, 0.4, 0.7, 0.5, 1, 1,
                    (j + 1) * 8, i * 8, 0.4, 0.7, 0.5, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.4, 0.7, 0.5, 1, 1,
                    j * 8, i * 8, 0.4, 0.7, 0.5, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.4, 0.7, 0.5, 1, 1,
                    j * 8, (i + 1) * 8, 0.4, 0.7, 0.5, 1, 1,
                )   
                else if (map[~~(i)][~~(j)] === 2) renderer.uploadVertices(
                    j * 8, i * 8, 0.8, 0.6, 0.6, 1, 1,
                    (j + 1) * 8, i * 8, 0.8, 0.6, 0.6, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.8, 0.6, 0.6, 1, 1,
                    j * 8, i * 8, 0.8, 0.6, 0.6, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.8, 0.6, 0.6, 1, 1,
                    j * 8, (i + 1) * 8, 0.8, 0.6, 0.6, 1, 1,
                )
                else if (map[~~(i)][~~(j)] === 3) renderer.uploadVertices(
                    j * 8, i * 8, 0.6, 0.5, 0.3, 1, 1,
                    (j + 1) * 8, i * 8, 0.6, 0.5, 0.3, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.6, 0.5, 0.3, 1, 1,
                    j * 8, i * 8, 0.6, 0.5, 0.3, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.6, 0.5, 0.3, 1, 1,
                    j * 8, (i + 1) * 8, 0.6, 0.5, 0.3, 1, 1,
                )
                else if (map[~~(i)][~~(j)] === 4) renderer.uploadVertices(
                    j * 8, i * 8, 0.6, 0.6, 0.6, 1, 1,
                    (j + 1) * 8, i * 8, 0.6, 0.6, 0.6, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.6, 0.6, 0.6, 1, 1,
                    j * 8, i * 8, 0.6, 0.6, 0.6, 1, 1,
                    (j + 1) * 8, (i + 1) * 8, 0.6, 0.6, 0.6, 1, 1,
                    j * 8, (i + 1) * 8, 0.6, 0.6, 0.6, 1, 1,
                )
            }
        }
    }
    drawLight(renderer, map) {
        for(let i = ~~(-this.BIVY/2 + this.y) - 1; i <= this.BIVY/2 + this.y + 1; i++) {
            for(let j = ~~(-this.BIVX/2 + this.x) - 1; j <= this.BIVX/2 + this.x + 1; j++) {
                if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) continue;

                let lightValue = map[~~(i)][~~(j)];
                if (map[~~(i)][~~(j)] != 0) renderer.uploadVertices(
                    j * this.BS, i * this.BS, lightValue, lightValue, lightValue, 1, 1,
                    (j + 1) * this.BS, i * this.BS, lightValue, lightValue, lightValue, 1, 1,
                    (j + 1) * this.BS, (i + 1) * this.BS, lightValue, lightValue, lightValue, 1, 1,
                    j * this.BS, i * this.BS, lightValue, lightValue, lightValue, 1, 1,
                    (j + 1) * this.BS, (i + 1) * this.BS, lightValue, lightValue, lightValue, 1, 1,
                    j * this.BS, (i + 1) * this.BS, lightValue, lightValue, lightValue, 1, 1,
                )
            }
        }
    }
    drawLightSmall(renderer, map) {
        for(let i = ~~(-this.BIVY/2) - 1; i <= this.BIVY/2 + 1; i++) {
            for(let j = ~~(-this.BIVX/2) - 1; j <= this.BIVX/2 + 1; j++) {
                let x = ~~(j + this.x);
                let y = ~~(i + this.y);
                if (y < 0 || x < 0 || y >= map.length || x >= map[0].length) continue;
                // if (i < 0 || j < 0 || i >= map.length || j >= map[0].length) continue;
                // console.log(i, j);
                let lightValue = map[y][x];
                renderer.uploadVertices(
                    j * 1, i * 1, lightValue, lightValue, lightValue, 1, 1,
                    (j + 1) * 1, i * 1, lightValue, lightValue, lightValue, 1, 1,
                    (j + 1) * 1, (i + 1) * 1, lightValue, lightValue, lightValue, 1, 1,
                    j * 1, i * 1, lightValue, lightValue, lightValue, 1, 1,
                    (j + 1) * 1, (i + 1) * 1, lightValue, lightValue, lightValue, 1, 1,
                    j * 1, (i + 1) * 1, lightValue, lightValue, lightValue, 1, 1,
                )
            }
        }
    }
}