import { vec2 } from "gl-matrix";
import { MersenneTwister19937, Random } from "random-js";
import { InputHandler, MouseEvent } from "../Hsinpa/Input/InputHandler";
import SimpleCanvas from "../Hsinpa/SimpleCanvas";
import WebglResource from "../Hsinpa/WebglResource";
import SC_Canvas, {ConstructionType} from "./SC_Canvas";
import {ImagesPath} from './SC_Static';

//Main entry point
export default class SC_Director {

    private m_sc_canvas : SC_Canvas;
    private m_simple_canvas: SimpleCanvas;
    private m_rand_engine : Random;
    private m_resource: WebglResource;
    private m_inputHandler : InputHandler;

    private m_mouse_position: vec2;

    constructor(canvas_dom_query: string, seed?: number) {
        this.m_rand_engine = this.get_random_engine(seed);

        this.m_mouse_position = vec2.create();
        this.m_inputHandler = new InputHandler();
        this.m_resource = new WebglResource();
        this.m_simple_canvas = new SimpleCanvas(canvas_dom_query);
        this.m_sc_canvas = new SC_Canvas(this.m_simple_canvas, this.m_rand_engine, this.m_resource);

        this.m_simple_canvas.Dom.addEventListener('mousemove', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Hover); } );
        this.m_simple_canvas.Dom.addEventListener('mousedown', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Down); } );
        this.m_simple_canvas.Dom.addEventListener('mouseup', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Up); } );

        this.process_preparation_stage();
    }

    private async process_preparation_stage() {
        await this.m_resource.GetImage(ImagesPath.leave_01);

        window.requestAnimationFrame(this.update.bind(this));
    }

    private update() {
        //this._inputHandler.OnUpdate();
        
        if (this.m_sc_canvas.construct_flag != ConstructionType.Complete) {
            this.m_sc_canvas.construct_on_the_fly();            
        } else {
            this.m_sc_canvas.render();
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    private get_random_engine(seed?: number) : Random {
        if (seed == undefined) {
            return new Random(MersenneTwister19937.autoSeed());
        } else
            return new Random(MersenneTwister19937.seed(seed));
    }

    private on_mouse_event(mouse_x: number, mouse_y: number, mouse_event: MouseEvent) {
        this.m_mouse_position[0] = mouse_x;
        this.m_mouse_position[1] = mouse_y;

        this.m_sc_canvas.draw_control_point(this.m_mouse_position);
    }


}