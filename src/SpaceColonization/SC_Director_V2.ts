import SimpleCanvas from "../Hsinpa/SimpleCanvas";
import { WorkerEventName } from "./SC_Static";

export default class SC_Director {
    private m_sc_worker: Worker;
    private m_simple_canvas: SimpleCanvas;

    constructor(canvas_dom_query: string, seed?: number) {
        this.m_simple_canvas = new SimpleCanvas(canvas_dom_query);
        this.m_sc_worker = new Worker(
            new URL('./SC_Worker.ts', import.meta.url),
                    {type: 'module', name:"classic_worker"}
        );

        this.m_sc_worker.postMessage({"event": WorkerEventName.World_Config,
            data: {seed: seed, width: this.m_simple_canvas.ScreenWidth, height: this.m_simple_canvas.ScreenHeight}
        });

        this.m_sc_worker.onmessage = (this.on_sc_worker_message.bind(this));
    }

    private on_sc_worker_message(ev: MessageEvent) {
        console.log(ev.data)
    }
}