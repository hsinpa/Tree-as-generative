import { Random } from "random-js";
import { WorkerEventName } from "./SC_Static";
import { IWorkerEvent, Rect } from "./SC_Types";
import { SpaceColonization } from "./SpaceColonization";
import { vec2 } from "gl-matrix";
import { RandomEngine } from "../Hsinpa/UtilityFunc";

console.log("Hello I am SC Worker");

class SC_Worker {
    private m_rand_engine: Random;
    private m_width: number;
    private m_height: number;
    private m_space_colonization: SpaceColonization;

    public execute_sc_colonization_creation(width: number, height: number, seed?: number,) {
        this.m_width = width;
        this.m_height = height;
        this.m_rand_engine = RandomEngine(seed);
        this.m_space_colonization = new SpaceColonization(20, 100, this.m_rand_engine);

        
        let attractor_y = height * this.m_rand_engine.real(0.4, 0.8);
        let width_offset = this.m_rand_engine.real(0.1, 0.2);
        let width_size_offset = this.m_rand_engine.real(0.6, 0.8);

        let candidate_node_size = this.m_rand_engine.integer(250, 350);

        let attractor_spawn_rect = new Rect(width * width_offset, 0, width * width_size_offset, attractor_y);
        this.m_space_colonization.spawn_attractor(attractor_spawn_rect, candidate_node_size);
        this.m_space_colonization.spawn_free_branch(width * 0.5, height);

        this.execute_grow_branch_recursion(this.m_space_colonization);
        this.on_prepare_stage_completed(this.m_space_colonization);

        return this.m_space_colonization;
    }

    private execute_grow_branch_recursion(space_colonization: SpaceColonization ) {
        let update_branch_num = space_colonization.grow_branch();
        space_colonization.calculate_branch_width();    

        if (update_branch_num == 0) {
            space_colonization.Branches.forEach(x => {
                let parent = space_colonization.BranchDict.get(x.parent);

                space_colonization.calculate_leaf(x);

                if (parent != null) {
                    vec2.subtract(x.direction, x.position, parent.position);
                    vec2.normalize(x.direction, x.direction);
                }
                
                x.rebuild_vertices(x.thickness);
            });

            return;
        };

        this.execute_grow_branch_recursion(space_colonization);
    }

    private on_prepare_stage_completed(space_colonization: SpaceColonization) {
        let maxBranchLens =  space_colonization.Branches.length;
        const maxEndpointThreshold = 10;

        for (let i = 0; i < maxBranchLens; i++) {
            let branch = space_colonization.Branches[i];
            let parent_branch = space_colonization.BranchDict.get(branch.parent);
            
            if (branch.child_count == 1) {

                let length = 0;
                let length_checked = false;
                let check_branch = branch;

                while (!length_checked) {
                    length++;

                    if (length > maxEndpointThreshold) {
                        length_checked = true;
                        continue;
                    };

                    if (check_branch.parent == undefined) {
                        length_checked = true;
                        continue;
                    }

                    if (parent_branch != undefined && parent_branch.child_count - check_branch.child_count > 1) {
                        length_checked = true;
                        continue;
                    }

                    check_branch = parent_branch;
                }


                if(length >= maxEndpointThreshold)
                    branch.is_valid_endpoint = true;
            }
        }
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
                    'branches': space_colonization.Branches,
                }
            });

            break;
    }
};