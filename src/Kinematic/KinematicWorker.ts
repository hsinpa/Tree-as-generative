import { vec2 } from "gl-matrix";
import { SC_Branch } from "../SpaceColonization/SC_Branch";
import { WorkerEventName } from "../SpaceColonization/SC_Static";
import { IWorkerEvent } from "../SpaceColonization/SC_Types";
import { ForwardKinematic } from "./ForwardKinematic";
import { InverseKinematic } from "./InverseKinematic";
import { Kinematics } from "./Kinematic";
import { Lerp } from "../Hsinpa/UtilityFunc";

console.log("Hello I am Kinematic Worker");

class KinematicsWorker {
    private m_kinematics: Kinematics;
    private m_branch_dict: Map<string, SC_Branch> = new Map(); 

    private m_forwardKinematic : ForwardKinematic;
    private m_invereseKinematic : InverseKinematic;

    public get branch_dict() {
        return this.m_branch_dict;
    }

    set_branches(branches: SC_Branch[]) {
        let b_length = branches.length;
        this.m_branch_dict.clear();

        for (let i = 0; i < b_length; i++) {
            let clone_branch = SC_Branch.convert(branches[i]);
            this.m_branch_dict.set(clone_branch.id, clone_branch);
        }

        this.m_forwardKinematic = new ForwardKinematic();
        this.m_invereseKinematic = new InverseKinematic();
    }

    public process(branch_id: string, head_position: vec2) {
        let target_branch = this.m_branch_dict.get(branch_id);

        if (this.m_forwardKinematic == null || this.m_invereseKinematic == null || target_branch == undefined) return;
        let root_branch = this.m_invereseKinematic.Execute(this.m_branch_dict, target_branch, head_position);
        
        this.m_forwardKinematic.Execute(this.m_branch_dict, root_branch, this.m_invereseKinematic.ik_set);
    }

    public resume() {
        this.m_branch_dict.forEach((value, key) => {
            if (value.is_root) return;

            let lerp_t = 0.06;
            value.position[0] = Lerp(value.position[0], value.static_position[0], lerp_t);
            value.position[1] = Lerp(value.position[1], value.static_position[1], lerp_t);
            value.direction[0] = Lerp(value.direction[0], value.static_direction[0], lerp_t);
            value.direction[1] = Lerp(value.direction[1], value.static_direction[1], lerp_t);

            value.rebuild_vertices(value.thickness);
        });
   
    }
}

const kinematics_worker = new KinematicsWorker();

self.onmessage = (msg) => {
    const event_dict: IWorkerEvent = msg.data;

    switch (event_dict.event) {
        case WorkerEventName.World_Is_Create: {
            console.log('Kinematics: message from main', event_dict);
            kinematics_worker.set_branches(event_dict['data']['branches']);
        }
        break;
        
        //When an endpoint is selected
        case WorkerEventName.ModeInteraction: {
            kinematics_worker.process(event_dict['data']['branch_id'],
                 vec2.fromValues(event_dict['data']['x'], event_dict['data']['y']));

                 postMessage({
                    'event': WorkerEventName.WorldUpdate,
                    'data': {
                        'branch_dict': kinematics_worker.branch_dict,
                    }
                });    
        }
        break;

        // When the mouse is free
        case WorkerEventName.WorldUpdate: {
            kinematics_worker.resume();

            postMessage({
                'event': WorkerEventName.WorldUpdate,
                'data': {
                    'branch_dict': kinematics_worker.branch_dict,
                }
            });   

        } break;
    }
};