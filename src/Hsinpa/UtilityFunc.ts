import { vec2 } from "gl-matrix";

export const Clamp = function(taget: number, max : number, min : number) {
    return Math.min(Math.max(taget, min), max);
}

export function RandomRange(min : number, max : number) {
    return ~~(Math.random() * (max - min + 1)) + min
};


export function NormalizeToBase(value: number, min : number, max : number) {
    return (value - min) / (max - min);
};

export function GetImagePromise(imagePath : string) {
    return new Promise<HTMLImageElement>( resolve => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.src = imagePath;
        im.onload = () => resolve(Object.assign(im));

        return im;
    });
}

export function Lerp(a: number, b : number, t : number) {
    return (a * (1 - t)) + (b * t);
}

export function LoopOps<T>(list: T[], callback : (target: T) => void ) {
    if (list == null || callback == null) return;

    let length = list.length;

    for (let i = length -1; i >= 0; i--) {
        callback( list[i] );
    }
}

export function RelativeAngle(direction_a: vec2, direction_b: vec2) {
    let dot = vec2.dot(direction_a, direction_b);
    let dist_a = vec2.len(direction_a);
    let dist_b = vec2.len(direction_b);

    return Math.acos(dot / (dist_a * dist_b));
}