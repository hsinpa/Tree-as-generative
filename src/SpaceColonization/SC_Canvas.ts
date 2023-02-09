import {SC_Node, SpaceColonization} from './SpaceColonization';
import SimpleCanvas from "../Hsinpa/SimpleCanvas";
import {CanvasHelper, ImageOption} from '../Canvas/CanvasHelper';
import { Rect } from './SC_Types';
import { SC_Branch, BranchEnum } from './SC_Branch';
import WebglResource from '../Hsinpa/WebglResource';
import { vec2 } from 'gl-matrix';
import {MersenneTwister19937, Random } from 'random-js';
import { Clamp } from '../Hsinpa/UtilityFunc';
import { Config, ImagesPath } from './SC_Static';
import SC_Leaf from './SC_Leaf';
import KDBush from "kdbush";

export enum ConstructionType {
    Branch, Leaf, Complete
}

export default class SC_Canvas {

    private m_space_colonization : SpaceColonization;
    private m_simple_canvas: SimpleCanvas;
    private m_canvas_helper: CanvasHelper;
    private m_resource: WebglResource;
    private m_rand_engine : Random;

    private m_construction_flag : ConstructionType = ConstructionType.Branch;
    public get construct_flag() {return this.m_construction_flag; }
    private m_last_process_index : number = 0;

    constructor(simple_canvas: SimpleCanvas, random_engine: Random, webResource: WebglResource) {
        this.m_rand_engine = random_engine;

        this.m_resource = webResource;
        this.m_simple_canvas = simple_canvas;
        this.m_canvas_helper = new CanvasHelper(this.m_simple_canvas.Context);
        this.m_space_colonization = new SpaceColonization(20, 100, this.m_rand_engine);

        let attractor_y = this.m_simple_canvas.ScreenHeight * 0.5;
        let attractor_spawn_rect = new Rect(this.m_simple_canvas.ScreenWidth * 0.2, 0, this.m_simple_canvas.ScreenWidth * 0.6, attractor_y);

        this.m_space_colonization.spawn_attractor(attractor_spawn_rect, 200);
        this.m_space_colonization.spawn_free_branch(this.m_simple_canvas.ScreenWidth * 0.5, this.m_simple_canvas.ScreenHeight);
    }

    public construct_on_the_fly() {
        this.m_canvas_helper.Clear(this.m_simple_canvas.ScreenWidth, this.m_simple_canvas.ScreenHeight);

        switch(this.m_construction_flag) {
            case ConstructionType.Branch: {
                
                this.draw_candidates(this.m_space_colonization.Leaves);
                this.draw_branch(this.m_space_colonization.Branches);
            
                let update_branch_num = this.m_space_colonization.grow_branch();
                this.m_space_colonization.calculate_branch_width();    

                if (update_branch_num == 0) {
                    this.m_space_colonization.Branches.forEach(x => {
                        this.calculate_leaf(x);
                    });

                    this.m_construction_flag = ConstructionType.Leaf;
                };        
            }

            case ConstructionType.Leaf: {
                let stepProcessLens = 3;
                let maxBranchLens =  this.m_space_colonization.Branches.length;
                let target_end_index = Clamp(this.m_last_process_index + stepProcessLens, maxBranchLens, 0);

                // let targets = this.m_space_colonization.Branches.slice(this.m_last_process_index, target_end_index);
                this.draw_branch(this.m_space_colonization.Branches);
                for (let i = 0; i < target_end_index; i++) {
                    this.draw_leaf(this.m_space_colonization.Branches[i], this.m_last_process_index / maxBranchLens);
                }
                
                this.m_last_process_index = target_end_index;

                if (this.m_last_process_index == maxBranchLens)
                    this.m_construction_flag = ConstructionType.Complete;
            }
        } 
    }

    public render() {
        this.m_canvas_helper.Clear(this.m_simple_canvas.ScreenWidth, this.m_simple_canvas.ScreenHeight);
        let maxBranchLens =  this.m_space_colonization.Branches.length;
        let endPointLens =  this.m_space_colonization.EndPoints.length;

        this.draw_branch(this.m_space_colonization.Branches);

        for (let i = 0; i < maxBranchLens; i++) {
            let branch = this.m_space_colonization.Branches[i];
            this.draw_leaf(branch, 1);

            if (branch.child_count == 1)
                this.m_canvas_helper.DrawSphere(branch.position[0], branch.position[1], 10, 0.5);
        }
    }

    public async draw_control_point(mouse_position: vec2) {
        // let kd_branch : KDBush<SC_Branch> = this.m_space_colonization.BranchKD;
        // let branches = this.m_space_colonization.Branches;
        // let filter_branches = kd_branch.within(mouse_position[0], mouse_position[1], 5);
        // let filter_lens = filter_branches.length;

        // for (let i = 0; i < filter_lens; i++) {
        //     let process_branch = branches[ filter_branches[i] ];

        //     if (process_branch.count == 0)
        //         console.log("Find");
        // }
    }


    private draw_candidates(leaves: SC_Node[]) {
        // let leaves = this.m_space_colonization.Leaves;
        let leaves_lens = leaves.length;

        for (let l = 0; l < leaves_lens; l++) {
            let leave = leaves[l];
            this.m_canvas_helper.DrawSphere(leave.position[0], leave.position[1], 3);
        }
    }

    private draw_branch(branches: SC_Branch[]) {
        // let branches = this.m_space_colonization.Branches;
        let branch_lens = branches.length;

        for (let i = 0; i < branch_lens; i++) {
            let branch = branches[i];
            if (branch.parent == null) continue;

            if (branch.is_vertices_set && branch.parent.is_vertices_set) {
                this.m_canvas_helper.DrawRect2D(branch.branch_vertices[0], branch.branch_vertices[1], branch.parent.branch_vertices[0], branch.parent.branch_vertices[1]);
            } else {
                this.m_canvas_helper.DrawLine(branch.parent.position, branch.position, branch.thickness);
            }
        }
    }

    private async calculate_leaf(source_branch: SC_Branch) {
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

    private draw_leaf(source_branch: SC_Branch, target_scale: number) {
        let spawn_leaf_length = source_branch.branch_leaf.length;
        let leaf_tex = this.m_resource.ForceGetImage(ImagesPath.leave_01);

        for (let i = 0; i < spawn_leaf_length; i++) {
            let leaf = source_branch.branch_leaf[i];
            let spawn_position = vec2.lerp(vec2.create(), source_branch.position, source_branch.parent.position, leaf.lerp_t);

            let options: ImageOption = {base_scale: leaf.scale, target_scale: target_scale, dx : 0, dy: 0}
    
            options.translation = spawn_position;
            
            let random_direction_nor = vec2.fromValues(source_branch.direction[0], source_branch.direction[1]);
                                        vec2.normalize(random_direction_nor, random_direction_nor);
    
            options.rotation = Math.atan2(random_direction_nor[1], random_direction_nor[0]) + leaf.relative_angle;
            options.dy = -leaf_tex.height * 0.5 * options.base_scale * options.target_scale;
    
            this.m_canvas_helper.DrawImage(leaf_tex, spawn_position , options);
        }
    }

}