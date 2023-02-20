import { vec2 } from "gl-matrix";
import { Dictionary } from "typescript-collections";
import {Clamp} from '../Hsinpa/UtilityFunc';
import { SC_Branch } from "../SpaceColonization/SC_Branch";

export class InverseKinematic {
    private _open_list : SC_Branch[] = [];
    private _cache_direction: vec2 = vec2.create();
    private _cache_position: vec2 = vec2.create();
    private _cache_head: vec2 = vec2.create();

    ik_set: Set<string> = new Set<string>();

    constructor() {

    }

    public Execute(head_branch: SC_Branch, head_position: vec2) {
        this.ik_set.clear();
        let decay = -0.01;
        let strength = 1;
        let current_process_branch: SC_Branch = head_branch;
        let current_head = vec2.copy(this._cache_head, head_position);

        while(current_process_branch != null && current_process_branch.parent != null) {
            this.ik_set.add(current_process_branch.id);            

            let original_length = vec2.dist(current_process_branch.parent.position, current_process_branch.position);

            vec2.subtract( this._cache_direction,  current_head, current_process_branch.parent.position);
            vec2.normalize(this._cache_direction, this._cache_direction); // Get Direction

            vec2.lerp(this._cache_direction, current_process_branch.static_direction, this._cache_direction, 1);

            vec2.copy(current_process_branch.direction, this._cache_direction);
            
            vec2.scale(this._cache_direction, this._cache_direction, -1); // Revert and scale by length

            vec2.scale(this._cache_direction, this._cache_direction, original_length); // Revert and scale by length
            
            vec2.add(this._cache_position, current_head, this._cache_direction);

            current_process_branch.position[0] =  current_head[0];
            current_process_branch.position[1] =  current_head[1];

            current_head = vec2.copy(current_head, this._cache_position);

            if (current_process_branch.parent == null) return current_process_branch;

            current_process_branch = current_process_branch.parent;
        }

        return current_process_branch;
    }
}