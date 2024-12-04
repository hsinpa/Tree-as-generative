import { quat, vec2 } from "gl-matrix";
import { SC_Branch } from "../SpaceColonization/SC_Branch";
import {Config} from '../SpaceColonization/SC_Static';

export class ForwardKinematic {

    private m_open : SC_Branch[] = [];
    private m_cache_direction: vec2 = vec2.create();

    private m_zero_vector = vec2.create();
    private m_rotate_vector1 = vec2.create();
    private m_rotate_vector2 = vec2.create();


    public Execute(branch_dict: Map<string, SC_Branch>, root_branch: SC_Branch, ik_set: Set<string>) {
        this.m_open.splice(0, this.m_open.length);

        if (root_branch.children == null) return;

    
        this.m_open = Object.assign(this.m_open, root_branch.children.map(x=> branch_dict.get(x)));
        
        while (this.m_open.length > 0) {

            let current_branch = this.m_open[0];
            let parent_branch = branch_dict.get(current_branch.parent);

            this.m_open.splice(0, 1);

            if (current_branch.children != null) current_branch.children.forEach(x=> this.m_open.push(                
                branch_dict.get(x)
            ));

            //Ignore branch, which is already manipulate by IK
            if (ik_set.has(current_branch.id)) continue;

            if (parent_branch == undefined) continue;

            let length = vec2.dist(current_branch.static_position, parent_branch.static_position);
0
            let relative_angle = vec2.angle(parent_branch.static_direction, parent_branch.direction) ;// RelativeAngle(current_branch.parent.static_direction, current_branch.static_direction);
            if (relative_angle < 0.001 && relative_angle > -0.001) relative_angle = 0;


            let candidate_angle_left = vec2.rotate(this.m_rotate_vector1, parent_branch.static_direction, this.m_zero_vector, -relative_angle);
            let candidate_angle_right = vec2.rotate(this.m_rotate_vector2, parent_branch.static_direction, this.m_zero_vector, relative_angle);

            let direction_scale = (vec2.dist(candidate_angle_right, parent_branch.direction) <  vec2.dist(candidate_angle_left, parent_branch.direction)) ? 1 : -1;

            this.m_cache_direction = vec2.rotate(this.m_cache_direction, current_branch.static_direction, this.m_zero_vector,  (relative_angle * direction_scale ));

            vec2.copy(current_branch.direction, this.m_cache_direction);

            vec2.scale(this.m_cache_direction, this.m_cache_direction, length);
            
            vec2.add(current_branch.position, parent_branch.position, this.m_cache_direction);

            current_branch.rebuild_vertices(current_branch.thickness);
            branch_dict.set(current_branch.id, current_branch);
        }
    }
}