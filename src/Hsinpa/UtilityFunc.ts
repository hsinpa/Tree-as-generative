import { vec2 } from "gl-matrix";
import { MersenneTwister19937, Random } from "random-js";

export const Clamp = function(taget: number, max : number, min : number) {
    return Math.min(Math.max(taget, min), max);
}

export function RandomRange(min : number, max : number) {
    return ~~(Math.random() * (max - min + 1)) + min
};

export function Choice(array: any[], seed?: number) {
    if (seed == null) {
        seed = new Date().getTime();
    }

    let engine = RandomEngine();
    let random_index = engine.integer( 0, array.length - 1);
    return array[random_index];
}

export function RandomEngine(seed?: number) : Random {
    if (seed == undefined) {
        return new Random(MersenneTwister19937.autoSeed());
    } else
        return new Random(MersenneTwister19937.seed(seed));
}

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