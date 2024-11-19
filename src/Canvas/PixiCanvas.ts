import { Application, Assets, Color, Container, Graphics, Sprite, Texture, Ticker } from "pixi.js";
import { SC_Node } from "../SpaceColonization/SpaceColonization";
import { SC_Branch } from "../SpaceColonization/SC_Branch";
import { DrawImage, DrawLine, DrawRect2D, Drawsphere } from "./PixiHelper";
import { vec2 } from "gl-matrix";
import WebglResource from "../Hsinpa/WebglResource";
import { ImageOption } from "./CanvasHelper";
import { Config, ImagesPath } from "../SpaceColonization/SC_Static";
import * as H_Color from '../Hsinpa/Color';
import { Clamp } from "../Hsinpa/UtilityFunc";

class PixiCanvas {
    private m_pixi_app: Application;
    private m_leaf_texture: Texture;

    private m_branch_g_container = new Container();
    private m_leaves_g_container = new Container();
    private m_ctrl_g_container = new Container();

    private m_branch_dict: Map<string, SC_Branch>;
    private m_end_point_list: SC_Branch[];

    private m_branch_graphics_dict: Map<string, Graphics>;
    private m_end_point_graphics_dict: Map<string, Graphics>;
    private m_leaf_graphics_dict: Map<string, Sprite>;

    public get ScreenHeight() { return this.m_pixi_app.canvas.height; }

    public get ScreenWidth() { return this.m_pixi_app.canvas.width; }

    public get Canvas() { return this.m_pixi_app.canvas; }

    constructor(pixi_application: Application) {
        this.m_leaf_graphics_dict = new Map();
        this.m_branch_dict = new Map();
        this.m_branch_graphics_dict = new Map();
        this.m_end_point_graphics_dict = new Map();
        this.m_end_point_list = [];

        this.m_pixi_app = pixi_application;

        this.m_branch_g_container.zIndex = 0;
        this.m_leaves_g_container.zIndex = 1;
        this.m_ctrl_g_container.zIndex = 2;
    }

    public async init_canvas(holder_dom_query: string) {
        let selected_dom = document.querySelector(holder_dom_query);
        await this.m_pixi_app.init({ width: 512, height: 512 });

        this.m_leaf_texture = await Assets.load(ImagesPath.leave_01);

        this.m_pixi_app.renderer.background.color = new Color([0.9,0.9,0.9]);

        if (selected_dom != undefined) {
            selected_dom.appendChild(this.m_pixi_app.canvas);
        }

        this.m_pixi_app.stage.addChild(this.m_branch_g_container);
        this.m_pixi_app.stage.addChild(this.m_leaves_g_container);
        this.m_pixi_app.stage.addChild(this.m_ctrl_g_container);
    }

    private render_candidate_nodes(node: SC_Node[]) {
        const node_length = node.length;

        for (let i = 0; i < node_length; i++) {
            let node_pos = node[i].position;
            
            let leaf_graphic = Drawsphere(
                {color: [120 / 255, 80 / 255, 1], x: node_pos[0], y: node_pos[1], radius: 2}
            )         
        
            this.m_pixi_app.stage.addChild(leaf_graphic);
        }
    }

    private draw_branch(branch: SC_Branch) {
        if (branch.parent == null) return;
        
        const clone_branch_parent = this.m_branch_dict.get(branch.parent);
        let branch_graphic_source = this.m_branch_graphics_dict.get(branch.id);
        let endpoint_graphic_source = this.m_end_point_graphics_dict.get(branch.id);

        if (clone_branch_parent != undefined && branch.is_vertices_set && clone_branch_parent.is_vertices_set) {
            let branch_rect = DrawRect2D(branch.branch_vertices[0], branch.branch_vertices[1], 
                clone_branch_parent.branch_vertices[0], clone_branch_parent.branch_vertices[1], branch_graphic_source);
            
            if (branch_graphic_source == undefined) {
                this.m_branch_g_container.addChild(branch_rect);
                this.m_branch_graphics_dict.set(branch.id, branch_rect);    
            }
        } else {
            let branch_line = DrawLine(clone_branch_parent.position, branch.position, branch.child_count, branch_graphic_source);
            this.m_branch_g_container.addChild(branch_line);
            this.m_branch_graphics_dict.set(branch.id, branch_line);

            if (branch_graphic_source == undefined) {
                this.m_branch_g_container.addChild(branch_line);
                this.m_branch_graphics_dict.set(branch.id, branch_line);
            }
        }

        if (clone_branch_parent != undefined)
            this.init_leaf(branch, clone_branch_parent, 1);

        if (branch.is_valid_endpoint) {
            let ctrl_point_graphic = Drawsphere(
                {color: branch.style.color_array, x: branch.position[0], y: branch.position[1], radius: 10, alpha: 0.5,
                source: endpoint_graphic_source
                }
            )         
            
            if (endpoint_graphic_source == undefined) {
                this.m_end_point_graphics_dict.set(branch.id, ctrl_point_graphic);
                this.m_ctrl_g_container.addChild(ctrl_point_graphic);    
            }
        }
    }

    private init_leaf(source_branch: SC_Branch, parent_branch: SC_Branch, target_scale: number) {
        let spawn_leaf_length = source_branch.branch_leaf.length;
        
        for (let i = 0; i < spawn_leaf_length; i++) {
            let leaf = source_branch.branch_leaf[i];
            let leaf_graphic_source = this.m_leaf_graphics_dict.get(leaf.id);
            let spawn_position = vec2.lerp(vec2.create(), source_branch.position, parent_branch.position, leaf.lerp_t);

            let options: ImageOption = {base_scale: leaf.scale, target_scale: target_scale, dx : 0, dy: 0}
    
            options.translation = spawn_position;
            
            let random_direction_nor = vec2.fromValues(source_branch.direction[0], source_branch.direction[1]);
                                        vec2.normalize(random_direction_nor, random_direction_nor);
    
            options.rotation = Math.atan2(random_direction_nor[1], random_direction_nor[0]) + leaf.relative_angle;
            options.dy = this.m_leaf_texture.height * 0.8 * options.base_scale * options.target_scale;
            
            let sprite = DrawImage(this.m_leaf_texture, spawn_position, options, leaf_graphic_source);

            if (leaf_graphic_source == undefined) {
                this.m_leaves_g_container.addChild(sprite);
                this.m_leaf_graphics_dict.set(leaf.id, sprite);
            }
        }
    }

    public get_closest_endpoint(mouse_position: vec2) {
        let mouse_x = mouse_position[0];
        let mouse_y = mouse_position[1];
        let interact_avail_dist = 10;

        // if (branch == this.m_interact_branch) {
        //     branch.style.copy_value(Config.Leaf_Interact_Color);

        //     return;
        // }

        // for (let i = 0 ; i < this.m_end_point_list.length; i++) {
        //     let branch = this.m_end_point_list[i];
        //     let distance = vec2.distance(branch.position, mouse_position);

        //     if (distance <= interact_avail_dist) {
        //         let t = Clamp(1 - (distance / interact_avail_dist), 1, 0);

        //         // let new_color = H_Color.default.lerp(branch.original_style, Config.Leaf_Interact_Color, t);
        //         // new_color.a = 1;
        //         branch.style = new H_Color.default(0, 0, 255, 1);
        //     } else {
        //         branch.style = branch.original_style;    
        //     }
        // }

        for (let i = 0 ; i < this.m_end_point_list.length; i++) {
            let branch = this.m_end_point_list[i];
            let distance = vec2.distance(branch.position, mouse_position);

            if (distance <= interact_avail_dist) {
                return branch;
            }
        }

        return null;
    }

    public init_branch(branches: SC_Branch[]) {
        for (let i = 0; i < branches.length; i++) {
            let clone_branch = SC_Branch.convert(branches[i]);
            
            this.m_branch_dict.set(clone_branch.id, clone_branch);
            this.draw_branch(clone_branch);

            if (clone_branch.is_valid_endpoint) {
                this.m_end_point_list.push(clone_branch);
            }
        }

        console.log('this.m_end_point_list length', this.m_end_point_list.length);
    }

    public render(ticker: Ticker) {
        this.m_branch_dict.forEach((branch, key) => {
            this.draw_branch(branch);
        });
    }
}

export default PixiCanvas;