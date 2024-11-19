import { vec2 } from 'gl-matrix';
import { SC_Branch } from '../SpaceColonization/SC_Branch';
import {ForwardKinematic} from './ForwardKinematic';
import {InverseKinematic} from './InverseKinematic';

export class Kinematics {
    private m_forwardKinematic : ForwardKinematic;
    private m_invereseKinematic : InverseKinematic;

    constructor() {
        // this.m_forwardKinematic = new ForwardKinematic();
        // this.m_invereseKinematic = new InverseKinematic();
    }

    public Process(target_branch: SC_Branch, head_position: vec2) {
        let root_branch = this.m_invereseKinematic.Execute(target_branch, head_position);
    
        this.m_forwardKinematic.Execute(root_branch, this.m_invereseKinematic.ik_set);
    }
}