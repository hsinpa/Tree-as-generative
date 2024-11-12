import { Graphics } from "pixi.js"
import { ImageOption, RoundRectStruct } from "./CanvasHelper"
import { vec2 } from "gl-matrix";

export let DrawRoundRect = function(roundRect: RoundRectStruct) {
    let graphics = new Graphics();
    return graphics;
}

export let Drawsphere = function(
    {color, x, y, radius, alpha = 1}: {
        color: number[], x : number, y : number, radius: number, alpha? : number  }    ) {
    let graphics = new Graphics()
    .circle(x, y, radius)
    .fill([...color, alpha]);

    return graphics;
}

export let DrawLine = function(point_a : vec2, point_b : vec2, thickness: number) {
    const realPath = new Graphics();
    realPath.moveTo(point_a[0], point_a[1]);
    realPath.lineTo(point_b[0], point_b[1]);
    realPath.stroke({ width: thickness, color: [1,0,0] });

    return realPath;
}

export let DrawRect2D = function(front_left : vec2, front_right : vec2, back_left : vec2, back_right : vec2) {
    let graphics = new Graphics()
    .poly([ {x: front_left[0], y: front_left[1]}, {x: front_right[0], y: front_right[1]},
                    {x: back_right[0], y: back_right[1]}, {x: back_left[0], y: back_left[1]}
    ], true)
    .fill([0,0,0])

    return graphics;
}

export let DrawImage = function(texture: HTMLImageElement, position: vec2, options: ImageOption) {

}
