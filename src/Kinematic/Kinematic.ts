import { SC_Branch } from '../SpaceColonization/SC_Branch';
import {ForwardKinematic} from './FowardKinematic';
import {InverseKinematic} from './InverseKinematic';


export class Kinematics {

    private m_forwardKinematic : ForwardKinematic;
    private m_invereseKinematic : InverseKinematic;

    constructor() {
        this.m_forwardKinematic = new ForwardKinematic();
        this.m_invereseKinematic = new InverseKinematic();
    }

    public Process(target_branch: SC_Branch) {
        this.BackwardProcess(target_branch);
    }

    private BackwardProcess(branch: SC_Branch) {
        
    }

    private ForwardProcess() {
        
    }
}