import { vec2 } from "gl-matrix";
import {Clamp} from '../Hsinpa/UtilityFunc';
import { SC_Branch } from "../SpaceColonization/SC_Branch";

export class InverseKinematic {
    private _open_list : SC_Branch[] = [];
    private _cache_direction: vec2 = vec2.create();
    private _cache_position: vec2 = vec2.create();
    private _cache_head: vec2 = vec2.create();
    private m_branch_dict: Map<string, SC_Branch>;

    ik_set: Set<string> = new Set<string>();

    constructor(branch_dict: Map<string, SC_Branch>) {
        this.m_branch_dict = branch_dict;
    }

    public Execute(head_branch: SC_Branch, head_position: vec2) {
        this.ik_set.clear();
        let decay = -0.002;
        let strength = 1;
        let current_process_branch: SC_Branch = head_branch;
        let current_head = vec2.copy(this._cache_head, head_position);

        while(current_process_branch != null && (current_process_branch.parent == null) ) {
            let parent_branch : SC_Branch | undefined = this.m_branch_dict.get(current_process_branch.parent);
            this.ik_set.add(current_process_branch.id);            
            this._open_list.push(current_process_branch);

            strength += decay * current_process_branch.thickness;
            strength = Clamp(strength, 1, 0);

            let original_length = vec2.dist(parent_branch.position, current_process_branch.position);

            vec2.subtract( this._cache_direction,  current_head, parent_branch.position);
            vec2.normalize(this._cache_direction, this._cache_direction); // Get Direction

            vec2.lerp(this._cache_direction, current_process_branch.static_direction, this._cache_direction, strength);

            vec2.normalize(this._cache_direction, this._cache_direction); // Get Direction

            vec2.copy(current_process_branch.direction, this._cache_direction);
            
            vec2.scale(this._cache_direction, this._cache_direction, -1); // Revert and scale by length

            vec2.scale(this._cache_direction, this._cache_direction, original_length); // Revert and scale by length
            
            vec2.lerp(current_head, current_process_branch.static_position, current_head, strength);

            vec2.add(this._cache_position, current_head, this._cache_direction);

            current_process_branch.position[0] =  current_head[0];
            current_process_branch.position[1] =  current_head[1];

            current_head = vec2.copy(current_head, this._cache_position);

            if (current_process_branch.parent == null) return current_process_branch;

            current_process_branch = this.m_branch_dict.get(current_process_branch.parent);
        }

        this.backward_propagation(this._open_list);

        return current_process_branch;
    }

    backward_propagation(record_branch: SC_Branch[]) {
        let lens = record_branch.length;

        //Bottom up
        for (let i = lens - 1; i >= 0; i--) {
            let current_process_branch: SC_Branch = record_branch[i];
            let parent_branch: SC_Branch | undefined = this.m_branch_dict.get(current_process_branch.parent);

            if (parent_branch == null) continue;

            vec2.subtract( this._cache_direction,  current_process_branch.position, parent_branch.position);

            vec2.normalize(this._cache_direction, this._cache_direction); // Get Direction

            let original_length = vec2.dist(parent_branch.static_position, current_process_branch.static_position);

            vec2.scale(this._cache_position, this._cache_direction, original_length);
            vec2.add(this._cache_position, this._cache_position, parent_branch.position);

            current_process_branch.position[0] =  this._cache_position[0];
            current_process_branch.position[1] =  this._cache_position[1];
        }
    }
}