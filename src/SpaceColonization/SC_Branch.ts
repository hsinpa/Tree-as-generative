import {vec2 } from 'gl-matrix';
import { v4 as uuidv4 } from 'uuid';
import {Clamp, NormalizeToBase} from '../Hsinpa/UtilityFunc'
import SC_Leaf from './SC_Leaf';
import {Config} from './SC_Static';

import Color from '../Hsinpa/Color';

const thickness_modifier = 0.6;

export enum BranchEnum { Endpoint_Branch,  Thin_Branch, Thick_Branch }
export enum KinematicFlag { None, InverseKinematic, ForwardKinematic }

export interface BranchType {
    type : BranchEnum;
    value: number;
}

export class SC_Branch {
    id: string;

    //Transform
    position : vec2;
    direction: vec2; 

    static_position: vec2 = vec2.create();
    static_direction: vec2;

    children : SC_Branch[] = [];
    parent: SC_Branch;
    branch_leaf: SC_Leaf[];

    count: number = 0;
    candidate_count = 0;
    max_candidate = 15;

    child_count = 1; //Relevent to Thickness in visual
    branch_type : BranchType = { value: 1, type: BranchEnum.Thick_Branch };

    style: Color;
    original_style: Color;

    kinematic_flag : KinematicFlag = KinematicFlag.None;

    //Vertices
    branch_vertices: vec2[];
    private branch_direction_side: vec2;
    private branch_width: vec2;

    public is_valid_endpoint : boolean = false;

    public get is_vertices_set() {
        return (this.branch_vertices[0][0] != 0 && this.branch_vertices[0][1] != 0 && this.branch_vertices[1][0] != 0 && this.branch_vertices[1][1] != 0);
    }

    public get is_root() {
        return this.parent == null;
    }


    public get thickness() { 
        let thickness = this.child_count * thickness_modifier;
        thickness = Clamp(thickness, thickness, 5);
        return thickness;
    }

    constructor(p_postion : vec2, p_parent : SC_Branch) {
        this.id = uuidv4();
        this.position = p_postion;
        
        vec2.copy(this.static_position, p_postion);

        this.parent = p_parent;

        this.branch_direction_side = vec2.create();
        this.branch_width = vec2.create();
        
        this.original_style = new Color(220, 50, 50, 0.5);
        this.style = Object.assign(new Color(), this.original_style);

        this.branch_vertices = Array.of<vec2>(vec2.create(), vec2.create());
        this.direction = vec2.create();
        this.static_direction = vec2.create();
        this.branch_leaf = [];

        if (this.parent != null) {
            vec2.subtract(this.direction, this.position, this.parent.position);
            vec2.normalize(this.direction, this.direction);

            this.set_direction(this.direction, true);
        }
    }

    public reset() {
        this.direction = vec2.copy(this.direction, this.static_direction);
        this.count = 0;
    }

    public set_direction(p_direction : vec2, p_replace_origin = false) {
        this.direction = p_direction;

        if (p_replace_origin) {
            vec2.copy(this.static_direction, this.direction);

            //console.log(Math.atan2(this.static_direction[1], this.static_direction[0]));
        }
    }

    public next() {
        let next_vector = vec2.scale(vec2.create(), this.direction, Config.Branch_Length);
        let next_position = vec2.add(vec2.create(), this.position, next_vector);
        let child = new SC_Branch(next_position, this);

        this.children.push(child);

        return child;
    }

    public set_branch_type(thickness: number) {
        this.branch_type.type = BranchEnum.Thick_Branch;
        const buffer = 0.5;
        this.set_branch_helper(thickness, 15, buffer, BranchEnum.Thin_Branch);
        this.set_branch_helper(thickness, 3, buffer, BranchEnum.Endpoint_Branch);

            //let rot_diff = vec2.dot(this.direction, this.parent.direction);

        this.rebuild_vertices(thickness);
    }

    public rebuild_vertices(thickness: number) {
        vec2.rotate(this.branch_direction_side, this.direction, vec2.fromValues(0, 0), Math.PI * 0.5);
        vec2.scale(this.branch_width, this.branch_direction_side,  thickness);

        this.branch_vertices[0] = vec2.add(this.branch_vertices[0], this.position, this.branch_width);
        this.branch_vertices[1] = vec2.subtract(this.branch_vertices[1], this.position, this.branch_width);
    }

    private set_branch_helper(thickness: number, threshold: number, buffer: number, enumType : BranchEnum ) {
        if (thickness < threshold) {
            let lower_threshold = threshold - buffer;
            this.branch_type.type = enumType;
            this.branch_type.value = 1;

            if (thickness > lower_threshold) {
                this.branch_type.value = NormalizeToBase(thickness, lower_threshold, threshold);
            }
            return;
        }
    }



}