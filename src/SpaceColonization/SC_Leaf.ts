import { SC_Branch } from "./SC_Branch";
import { v4 as uuidv4 } from 'uuid';

export default class SC_Leaf {

    private m_branch: SC_Branch;
    public lerp_t: number;
    public relative_angle: number;
    public scale : number;
    public id: string;

    constructor(branch: SC_Branch, lerp_t : number, relative_angle: number, scale: number) {
        this.id = uuidv4();
        this.m_branch = branch;
        this.lerp_t = lerp_t;
        this.relative_angle = relative_angle;
        this.scale = scale;
    }
}