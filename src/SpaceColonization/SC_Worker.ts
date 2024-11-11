import { MersenneTwister19937, Random } from "random-js";
import { WorkerEventName } from "./SC_Static";
import { IWorkerEvent, Rect } from "./SC_Types";
import { SpaceColonization } from "./SpaceColonization";

console.log("Hello I am worker");

class SC_Worker {
    private m_rand_engine: Random;
    private m_width: number;
    private m_height: number;

    public execute_sc_colonization_creation(width: number, height: number, seed?: number,) {
        this.m_width = width;
        this.m_height = height;
        this.m_rand_engine = this.get_random_engine(seed);
        let m_space_colonization = new SpaceColonization(20, 100, this.m_rand_engine);

        let attractor_y = height * 0.5;
        let attractor_spawn_rect = new Rect(width * 0.2, 0, height * 0.6, attractor_y);
        m_space_colonization.spawn_attractor(attractor_spawn_rect, 200);

        return m_space_colonization;
    }

    private get_random_engine(seed?: number) : Random {
        if (seed == undefined) {
            return new Random(MersenneTwister19937.autoSeed());
        } else
            return new Random(MersenneTwister19937.seed(seed));
    }
}

const sc_worker = new SC_Worker();

self.onmessage = (msg) => {
    const event_dict: IWorkerEvent = msg.data;

    console.log('message from main', event_dict);

    switch (event_dict.event) {
        
        case WorkerEventName.World_Config:
            let space_colonization = sc_worker.execute_sc_colonization_creation(event_dict.data['width'], event_dict.data['height'], event_dict.data['seed']);

            postMessage({
                'event': WorkerEventName.World_Is_Create,
                'data': {
                    'branch_kd': space_colonization.BranchKD,
                    'leaves': space_colonization.Leaves,
                    'branches': space_colonization.Branches,
                    'end_points': space_colonization.EndPoints,    
                }
            });

            break;
    }
};