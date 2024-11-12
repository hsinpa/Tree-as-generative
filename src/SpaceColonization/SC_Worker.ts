import { MersenneTwister19937, Random } from "random-js";
import { Config, WorkerEventName } from "./SC_Static";
import { IWorkerEvent, Rect } from "./SC_Types";
import { SpaceColonization } from "./SpaceColonization";
import { BranchEnum, SC_Branch } from "./SC_Branch";
import { vec2 } from "gl-matrix";
import SC_Leaf from "./SC_Leaf";

console.log("Hello I am worker");

class SC_Worker {
    private m_rand_engine: Random;
    private m_width: number;
    private m_height: number;
    private m_space_colonization: SpaceColonization;

    public execute_sc_colonization_creation(width: number, height: number, seed?: number,) {
        this.m_width = width;
        this.m_height = height;
        this.m_rand_engine = this.get_random_engine(seed);
        this.m_space_colonization = new SpaceColonization(20, 100, this.m_rand_engine);

        let attractor_y = height * 0.5;
        let attractor_spawn_rect = new Rect(width * 0.2, 0, height * 0.6, attractor_y);

        this.m_space_colonization.spawn_attractor(attractor_spawn_rect, 200);
        this.m_space_colonization.spawn_free_branch(width * 0.5, height);

        this.execute_grow_branch_recursion(this.m_space_colonization);

        return this.m_space_colonization;
    }

    private execute_grow_branch_recursion(space_colonization: SpaceColonization ) {
        let update_branch_num = space_colonization.grow_branch();
        space_colonization.calculate_branch_width();    

        if (update_branch_num == 0) {
            space_colonization.Branches.forEach(x => {
                space_colonization.calculate_leaf(x);
            });

            return;
        };
        
        this.execute_grow_branch_recursion(space_colonization);
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
                    'branch_kd': space_colonization.BranchKD.data,
                    'leaves': space_colonization.Leaves,
                    'branches': space_colonization.Branches,
                }
            });

            break;
    }
};