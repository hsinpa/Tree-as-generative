import { vec2 } from "gl-matrix";
import { SC_Branch } from "../SpaceColonization/SC_Branch";
import { WorkerEventName } from "../SpaceColonization/SC_Static";
import { IWorkerEvent } from "../SpaceColonization/SC_Types";
import { ForwardKinematic } from "./ForwardKinematic";
import { InverseKinematic } from "./InverseKinematic";
import { Kinematics } from "./Kinematic";

console.log("Hello I am Kinematic Worker");

class KinematicsWorker {
    m_kinematics: Kinematics;
    m_branch_dict: Map<string, SC_Branch> = new Map(); 

    private m_forwardKinematic : ForwardKinematic;
    private m_invereseKinematic : InverseKinematic;

    set_branches(branches: SC_Branch[]) {
        let b_length = branches.length;
        this.m_branch_dict.clear();

        for (let i = 0; i < b_length; i++) {
            let clone_branch = SC_Branch.convert(branches[i]);
            this.m_branch_dict.set(clone_branch.id, clone_branch);
        }

        this.m_forwardKinematic = new ForwardKinematic(this.m_branch_dict);
        this.m_invereseKinematic = new InverseKinematic(this.m_branch_dict);
    }

    public process(branch_id: string, head_position: vec2) {
        let target_branch = this.m_branch_dict.get(branch_id);

        if (this.m_forwardKinematic == null || this.m_invereseKinematic == null || target_branch == undefined) return;

        let root_branch = this.m_invereseKinematic.Execute(target_branch, head_position);
    
        this.m_forwardKinematic.Execute(root_branch, this.m_invereseKinematic.ik_set);
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
    
        case WorkerEventName.ModeInteraction: {
            kinematics_worker.process(event_dict['data']['branch_id'],
                 vec2.fromValues(event_dict['data']['x'], event_dict['data'][1]));
        }break;
    }
};