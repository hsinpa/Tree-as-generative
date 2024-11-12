import { Random } from 'random-js';
import {vec2 } from 'gl-matrix';
import { BranchEnum, SC_Branch } from './SC_Branch';
import { Rect } from './SC_Types';
import KDBush from "kdbush";
import { Config } from './SC_Static';
import SC_Leaf from './SC_Leaf';

export interface SC_Node {
    position : vec2,
    reached: boolean,
}

interface KD_EndPoints { [key: string]: SC_Branch; }

export class SpaceColonization {
    private m_rand_engine : Random;
    private m_leaves : SC_Node[] = [];
    private m_branches : SC_Branch[] = [];
    private m_kd_candidates : KDBush = null;
    private m_kd_branches : KDBush = null;
    private m_kd_endpoints : KD_EndPoints = {};

    private m_min_distance : number;
    private m_max_distance : number;

    public get Leaves() {
        return this.m_leaves;
    }

    public get Branches() {
        return this.m_branches;
    }

    public get BranchKD() {
        return this.m_kd_branches;
    }

    constructor(min_distance : number, max_distance : number, random_engine : Random) {
        this.m_min_distance = min_distance;
        this.m_max_distance = max_distance;
        this.m_rand_engine = random_engine;
    } 

    public spawn_attractor(rect: Rect, spawn_length) {

        this.m_kd_candidates = new KDBush(spawn_length);

        this.m_leaves = [];
        for (let i = 0; i < spawn_length; i++) {
            let random_x = this.m_rand_engine.integer( rect.xMin, rect.xMax);
            let random_y = this.m_rand_engine.integer(rect.yMin, rect.yMax);

            let point = vec2.fromValues(random_x, random_y);
            this.m_leaves.push( {position : point, reached: false} );
            this.m_kd_candidates.add(point[0], point[1]);

            //console.log(`RandomX ${random_x}, RandomY ${random_y}`);
        }

        this.m_kd_candidates.finish();
    }

    public spawn_free_branch(root_x: number, root_y: number) {
        this.m_branches = []; 

        let root = new SC_Branch(vec2.fromValues(root_x, root_y), null);
            root.direction = vec2.fromValues(0, -1);

        this.m_branches.push(root);

        let current_branch = root;
        let leaves_lens = this.m_leaves.length;
        let max_trial = 50000;

        while (this.m_branches.length < max_trial) {

            if (current_branch == null) break;

            let found = false;

            let leave_index = this.m_kd_candidates.within(current_branch.position[0], current_branch.position[1], this.m_max_distance);
            let filter_length = leave_index.length;
            for (let i = 0; i < filter_length; i++) {
                let leave = this.m_leaves[ leave_index[i] ];
                let distance = vec2.distance( current_branch.position, leave.position);

                if (distance < this.m_max_distance) {
                    if (!found) found =  true;      
                }
            }

            if (!found) {
                let branch = current_branch.next();
                current_branch = branch;

                this.m_branches.push(branch);
                continue;
            }

            current_branch = null;
        }

        this.m_kd_branches = this.rebuild_kd_branches(this.m_branches);
    }

    /**
     *An iteration approach
     *
     * @memberof SpaceColonization
     */
    public grow_branch() {
        let leave_lens = this.m_leaves.length;
        let branch_lens = this.m_branches.length;

        for (let i = 0; i < leave_lens ; i++) {
            let leaf = this.m_leaves[i];
            let closestBranch : SC_Branch = null;
            let record = this.m_max_distance;

            let filter_branches = this.m_kd_branches.within(leaf.position[0], leaf.position[1], this.m_max_distance);
            let filter_length = filter_branches.length;
            
            for (let j = filter_length - 1; j >= 0; j--) {
                let branch = this.m_branches[filter_branches[j]];
                let distance  = vec2.distance(branch.position, leaf.position);

                if (distance < this.m_min_distance) {
                    leaf.reached = true;
                    closestBranch = null;
                    break;
                } else if  (distance < record && branch.candidate_count < branch.max_candidate) {
                    closestBranch = branch;
                    record = distance;
                }
            }

            if (closestBranch != null) {
                let newDir = vec2.subtract(vec2.create(), leaf.position, closestBranch.position);
                    vec2.normalize(newDir, newDir);

                closestBranch.direction = vec2.add(closestBranch.direction,  closestBranch.direction, newDir);

                closestBranch.count++;
                closestBranch.candidate_count++;
            }
        }

        let update_branch = 0;
        //Remove connect leaf
        for (let i = leave_lens - 1; i >= 0; i--) {

            if (this.m_leaves[i].reached) {
                this.m_leaves.splice(i, 1);
            }
        }

        for (let i = branch_lens - 1; i >= 0; i--) {
            var branch = this.m_branches[i];
            if (branch.count > 0) {
                let average_direction = branch.direction;
                update_branch++;

                vec2.scale(average_direction, average_direction, 1 / (branch.count + 1));
                //vec2.normalize(average_direction, average_direction);

                branch.set_direction(average_direction);

                let nextBranch = branch.next();
                
                //Record endpoints
                this.m_kd_endpoints[nextBranch.id] = nextBranch;
                if (branch.id in this.m_kd_endpoints) {
                    delete this.m_kd_endpoints[branch.id];      
                }

                this.m_branches.push(nextBranch);

                branch.reset();
            }
        }

        this.m_kd_candidates = this.rebuild_kd_leaves(this.m_leaves);
        this.m_kd_branches = this.rebuild_kd_branches(this.m_branches);

        return update_branch;
    }

    public calculate_branch_width() {
        let endpointKeys = Object.keys(this.m_kd_endpoints);
        let l = endpointKeys.length;
        
        for (let i = 0; i < l; i++) {
            let current_branch = this.m_kd_endpoints[ endpointKeys[i] ];

            while (current_branch != null) {
                current_branch.set_branch_type(current_branch.thickness);
                
                let parent_branch = current_branch.parent;

                if (parent_branch == null) break;
                
                if (parent_branch.child_count <= current_branch.child_count) {
                    parent_branch.child_count = current_branch.child_count + 1;
                } else {
                  break;  
                }
                
                current_branch = parent_branch;
            }
        }
    }

    public calculate_leaf(source_branch: SC_Branch) {
        if (source_branch.branch_leaf.length > 0) return;
        if (source_branch.branch_type.type ==  BranchEnum.Thick_Branch) return;
        
        let spawn_percent = this.m_rand_engine.realZeroToOneInclusive();
        
        if (source_branch.branch_type.type == BranchEnum.Thin_Branch && spawn_percent > Config.Leaf_ThinBranch_Rate) return;
        if (source_branch.branch_type.type == BranchEnum.Endpoint_Branch && spawn_percent > Config.Leaf_Endpoint_Rate) return;

        let spawn_leaf_length = this.m_rand_engine.integer(1, 3);

        for (let i = 0; i < spawn_leaf_length; i++) {
            let spawn_leaf_t = this.m_rand_engine.realZeroToOneExclusive();
            let spawn_position = vec2.lerp(vec2.create(), source_branch.position, source_branch.parent.position, spawn_leaf_t);
            spawn_position = vec2.subtract(spawn_position, spawn_position, source_branch.position);
            
            let rotation_range = 0.25;
            let random_direction_x = (this.m_rand_engine.real(-1, 1) * Math.PI * rotation_range);
            let random_direction_y = (this.m_rand_engine.real(-1, 1) * Math.PI * rotation_range);
    
            let random_direction_nor = vec2.fromValues(random_direction_x, random_direction_y);
                                        vec2.normalize(random_direction_nor, random_direction_nor);
    
            let rotation = Math.atan2(random_direction_nor[1], random_direction_nor[0]);
            let scale = 0.5;

            let new_leaf = new SC_Leaf(source_branch, spawn_leaf_t, rotation, 0.5);
            source_branch.branch_leaf.push(new_leaf);
        }
    }


    public rebuild_kd_branches(branches: SC_Branch[]) {
        // Rebuld Branch KD
        let branch_length = branches.length;
        let kd_branches = new KDBush(branch_length);

        for (let branch_index= 0; branch_index < branch_length; branch_index++) {
            kd_branches.add(branches[branch_index].position[0], branches[branch_index].position[1]);
        }
        
        kd_branches.finish();
        
        return kd_branches;
    }

    public rebuild_kd_leaves(leave_nodes: SC_Node[]) {
        // Rebuld Leave KD
        let leave_length = leave_nodes.length;
        let kd_candidates = new KDBush(leave_length);

        for (let leave_index= 0; leave_index < leave_length; leave_index++) {
            kd_candidates.add(leave_nodes[leave_index].position[0], leave_nodes[leave_index].position[1]);
        }

        kd_candidates.finish();

        return kd_candidates;
    }
}