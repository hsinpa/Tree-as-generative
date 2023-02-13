import {Lerp} from './UtilityFunc';

export default class Color {
    private _a: number = 1;
    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;

    get a() { return this._a};
    get r() { return this._r};
    get g() { return this._g};
    get b() { return this._b};

    set a(v: number) {
        this._a = v;
        this.recreate_style();
    }

    set r(v: number) {
        this._r = v;
        this.recreate_style();
    }

    set g(v: number) {
        this._g = v;
        this.recreate_style();
    }

    set b(v: number) {
        this._b = v;
        this.recreate_style();
    }

    private _style: string = "rgba(0, 0, 0, 1)";

    get style() {
        return this._style;
    }
    constructor(r? : number, g? : number, b? : number, a? : number) {
        if (r != undefined)  this._r = r;
        if (g != undefined)  this._g = g;
        if (b != undefined)  this._b = b;
        if (a != undefined)  this._a = a;

        this.set_value(this._r, this._g, this._b, this._a);
    }

    public set_value(r : number, g : number, b : number, a : number) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;

        this.recreate_style();
    }

    public copy_value(source_color: Color) {
        this._r = source_color.r;
        this._g = source_color.g;
        this._b = source_color.b;
        this._a = source_color.a;

        this.recreate_style();
    }

    private recreate_style() {
        this._style = `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
    }
    
    static lerp(color_a: Color, color_b: Color, t: number, source? : Color) : Color{

        let l_r =  Lerp(color_a.r, color_b.r, t);
        let l_g = Lerp(color_a.g, color_b.g, t);
        let l_b = Lerp(color_a.b, color_b.b, t);
        let l_a = Lerp(color_a.a, color_b.a, t);

        if(source != null) {
            source.set_value(l_r, l_g, l_b, l_a);

            return source;
        }

        return new Color(l_r, l_g, l_b, l_a);
    }
}