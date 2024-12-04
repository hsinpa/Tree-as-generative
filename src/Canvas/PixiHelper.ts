import { Graphics, GraphicsPath, Sprite, Texture } from "pixi.js"
import { ImageOption, RoundRectStruct } from "./CanvasHelper"
import { vec2 } from "gl-matrix";

export let DrawRoundRect = function(roundRect: RoundRectStruct) {
    let graphics = new Graphics();
    return graphics;
}

export let DrawCtrlPoint = function({x, y, source = undefined }:
     {x : number, y : number, source?: Graphics} ) {

    let graphics = source;
    if (graphics == undefined)
        graphics = new Graphics();
    graphics.clear();

    graphics    
    .circle(x, y, 14)
    .fill([0, 0, 1, 1])
    .circle(x, y, 10)
    .fill([1, 1, 1, 1]);

    return graphics;
}

export let Drawsphere = function(
    {color, x, y, radius, alpha = 1, source = undefined}: {
        color: number[], x : number, y : number, radius: number, alpha? : number, source?: Graphics} ) {

    let graphics = source;
    if (graphics == undefined)
        graphics = new Graphics();
    graphics.clear();
    
    graphics    
    .circle(x, y, radius)
    .fill([...color, alpha]);

    return graphics;
}

export let DrawLine = function(point_a : vec2, point_b : vec2, thickness: number, source?: Graphics) {
    let realPath = source;
    if (realPath == undefined)
        realPath = new Graphics();

    realPath.moveTo(point_a[0], point_a[1]);
    realPath.lineTo(point_b[0], point_b[1]);
    realPath.stroke({ width: thickness, color: [1,0,0] });

    return realPath;
}

export let DrawRect2D = function(front_left : vec2, front_right : vec2, back_left : vec2, back_right : vec2, 
    fill_color: number[], source?: Graphics) {
    let graphics = source;
    if (graphics == undefined) {
        graphics = new Graphics();
    }

    graphics.clear();
    graphics.poly([ {x: front_left[0], y: front_left[1]}, {x: front_right[0], y: front_right[1]},
                    {x: back_right[0], y: back_right[1]}, {x: back_left[0], y: back_left[1]}
    ], true)
    .fill(fill_color)


    return graphics;
}

export let DrawImage = function(texture: Texture, position: vec2, options: ImageOption, source?: Sprite) {
    let sprite = source;
    if (sprite == undefined) {
        sprite = new Sprite(texture);
        sprite.tint = 'white';
    }

    let w_ratio = texture.width / texture.height;
    sprite.anchor.set(0, 0.5);

    sprite.setSize(options.dy * w_ratio, options.dy);

    sprite.x = (position[0]);
    sprite.y =  (position[1]);
    sprite.rotation = options.rotation;
    
    return sprite;
}
