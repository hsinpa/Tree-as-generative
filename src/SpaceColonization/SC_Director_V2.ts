import { Application, Ticker } from "pixi.js";
import PixiCanvas from "../Canvas/PixiCanvas";
import WebglResource from "../Hsinpa/WebglResource";
import { WorkerEventName } from "./SC_Static";
import { InputHandler, MouseEvent } from "../Hsinpa/Input/InputHandler";
import { vec2 } from "gl-matrix";
import { SC_Branch } from "./SC_Branch";
import { Mode } from "./SC_Types";

export default class SC_Director {
    private m_sc_worker: Worker;
    private m_kinematic_worker: Worker;

    private m_pixi_canvas: PixiCanvas;
    private m_seed: number;
    private m_pixi_app: Application;
    private m_mouse_position: vec2;

    private m_candidate_branch: SC_Branch;
    private m_mode: Mode = Mode.Idle;

    constructor(canvas_dom_query: string, seed?: number) {
        this.m_pixi_app = new Application();
        this.m_pixi_canvas = new PixiCanvas(this.m_pixi_app);
        this.m_seed = seed;
        this.m_mouse_position = vec2.create();

        this.m_sc_worker = new Worker(
            new URL('./SC_Worker.ts', import.meta.url),
                    {type: 'module', name:"sc_worker"}
        );

        this.m_kinematic_worker = new Worker(
            new URL('../Kinematic/KinematicWorker.ts', import.meta.url),
                    {type: 'module', name:"kinematic_worker"}
        );

        this.m_sc_worker.onmessage = (this.on_sc_worker_message.bind(this));
        this.create_canvas_colonization(canvas_dom_query);
    }

    private async create_canvas_colonization(canvas_dom_query: string) {
        await this.m_pixi_canvas.init_canvas(canvas_dom_query);

        this.m_sc_worker.postMessage({"event": WorkerEventName.World_Config,
            data: {seed: this.m_seed, width: this.m_pixi_canvas.ScreenWidth, height: this.m_pixi_canvas.ScreenHeight}
        });

        this.m_pixi_app.ticker.add(this.update.bind(this));

        this.m_pixi_app.canvas.addEventListener('mousemove', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Hover); } );
        this.m_pixi_app.canvas.addEventListener('mousedown', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Down); } );
        this.m_pixi_app.canvas.addEventListener('mouseup', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Up); } );
    }


    // Callback Event
    public update(ticker: Ticker) {
        this.process_mouse_activity();
        this.m_pixi_canvas.render(ticker);
    }

    private on_sc_worker_message(ev: MessageEvent) {
        console.log(ev.data);

        switch (ev.data['event']){
            case WorkerEventName.World_Is_Create:
                this.m_kinematic_worker.postMessage(ev.data);
                this.m_pixi_canvas.init_branch(ev.data['data']['branches']);
                break;
        }
    }

    private process_mouse_activity() {
        if (this.m_mode == Mode.Idle) {
            this.m_candidate_branch = this.m_pixi_canvas.get_closest_endpoint(this.m_mouse_position);
        } 

        if (this.m_mode == Mode.Interaction && this.m_candidate_branch != undefined) {
            this.m_kinematic_worker.postMessage({"event": WorkerEventName.ModeInteraction,
                data: {branch_id: this.m_candidate_branch.id, 
                        x: this.m_mouse_position[0], y: this.m_mouse_position[1]}
            });
        }
    }

    private on_mouse_event(mouse_x: number, mouse_y: number, mouse_event: MouseEvent) {
        this.m_mouse_position[0] = mouse_x;
        this.m_mouse_position[1] = mouse_y;

        if (mouse_event == MouseEvent.Down && this.m_candidate_branch != null) {
            this.m_mode = Mode.Interaction;
        }

        if (mouse_event == MouseEvent.Up) {
            this.m_mode = Mode.Idle;
        }
    }

    // End Callback Event
}
