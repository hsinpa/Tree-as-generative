import PixiCanvas from "../Canvas/PixiCanvas";
import SimpleCanvas from "../Hsinpa/SimpleCanvas";
import { WorkerEventName } from "./SC_Static";

export default class SC_Director {
    private m_sc_worker: Worker;
    private m_pixi_canvas: PixiCanvas;
    private m_seed: number;

    constructor(canvas_dom_query: string, seed?: number) {
        this.m_pixi_canvas = new PixiCanvas();
        this.m_seed = seed;
        this.m_sc_worker = new Worker(
            new URL('./SC_Worker.ts', import.meta.url),
                    {type: 'module', name:"classic_worker"}
        );

        this.m_sc_worker.onmessage = (this.on_sc_worker_message.bind(this));
        this.create_canvas_colonization(canvas_dom_query);
    }

    private on_sc_worker_message(ev: MessageEvent) {
        console.log(ev.data);

        switch (ev.data['event']){
            case WorkerEventName.World_Is_Create:
                this.m_pixi_canvas.update_leaf(ev.data['data']['leaves']);
                break;
        }
    }

    private async create_canvas_colonization(canvas_dom_query: string) {
        await this.m_pixi_canvas.init_canvas(canvas_dom_query);

        this.m_sc_worker.postMessage({"event": WorkerEventName.World_Config,
            data: {seed: this.m_seed, width: this.m_pixi_canvas.ScreenWidth, height: this.m_pixi_canvas.ScreenHeight}
        });
    }
}