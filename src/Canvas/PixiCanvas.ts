import { Application, Assets, Color, Container, Graphics, Sprite, Texture } from "pixi.js";
import { SC_Node } from "../SpaceColonization/SpaceColonization";
import { SC_Branch } from "../SpaceColonization/SC_Branch";
import { DrawImage, DrawLine, DrawRect2D, Drawsphere } from "./PixiHelper";
import { vec2 } from "gl-matrix";
import WebglResource from "../Hsinpa/WebglResource";
import { ImageOption } from "./CanvasHelper";
import { ImagesPath } from "../SpaceColonization/SC_Static";

class PixiCanvas {
    private m_pixi_app: Application;
    private m_web_resource: WebglResource;
    private m_leaf_texture: Texture;

    private m_branch_g_container = new Container();
    private m_leaves_g_container = new Container();
    private m_ctrl_g_container = new Container();

    private m_leaf_dict: Map<string, Sprite>;
    private m_branch_dict: Map<string, SC_Branch>;
    private m_branch_graphics_dict: Map<string, Graphics>;
    private m_end_point_dict: Map<string, Graphics>;

    public get ScreenHeight() { return this.m_pixi_app.canvas.height; }

    public get ScreenWidth() { return this.m_pixi_app.canvas.width; }

    constructor(webResource: WebglResource) {
        this.m_leaf_dict = new Map();
        this.m_branch_dict = new Map();
        this.m_branch_graphics_dict = new Map();
        this.m_end_point_dict = new Map();

        this.m_web_resource = webResource;
        this.m_pixi_app = new Application();

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

        this.m_pixi_app.ticker.add(this.render.bind(this));
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
        
        if (clone_branch_parent != undefined && branch.is_vertices_set && clone_branch_parent.is_vertices_set) {
            let branch_rect = DrawRect2D(branch.branch_vertices[0], branch.branch_vertices[1], clone_branch_parent.branch_vertices[0], clone_branch_parent.branch_vertices[1]);
            
            
            this.m_branch_g_container.addChild(branch_rect);
        } else {
            let branch_line = DrawLine(clone_branch_parent.position, branch.position, branch.child_count);
            this.m_branch_g_container.addChild(branch_line);
        }

        if (clone_branch_parent != undefined)
            this.init_leaf(branch, clone_branch_parent, 1);

        if (branch.is_valid_endpoint) {
            let ctrl_point_graphic = Drawsphere(
                {color: [220 / 255, 0 / 255, 0.5], x: branch.position[0], y: branch.position[1], radius: 10, alpha: 0.5}
            )         

            this.m_ctrl_g_container.addChild(ctrl_point_graphic);
        }
    }

    private init_leaf(source_branch: SC_Branch, parent_branch: SC_Branch, target_scale: number) {
        let spawn_leaf_length = source_branch.branch_leaf.length;
        
        for (let i = 0; i < spawn_leaf_length; i++) {
            
            let leaf = source_branch.branch_leaf[i];
            let spawn_position = vec2.lerp(vec2.create(), source_branch.position, parent_branch.position, leaf.lerp_t);

            let options: ImageOption = {base_scale: leaf.scale, target_scale: target_scale, dx : 0, dy: 0}
    
            options.translation = spawn_position;
            
            let random_direction_nor = vec2.fromValues(source_branch.direction[0], source_branch.direction[1]);
                                        vec2.normalize(random_direction_nor, random_direction_nor);
    
            options.rotation = Math.atan2(random_direction_nor[1], random_direction_nor[0]) + leaf.relative_angle;
            options.dy = this.m_leaf_texture.height * 0.8 * options.base_scale * options.target_scale;
            
            let sprite = DrawImage(this.m_leaf_texture, spawn_position, options);

            this.m_leaf_dict.set(leaf.id, sprite);

            this.m_leaves_g_container.addChild(sprite);
        }
    }

    public update_leaf(node: SC_Node[]) {
        // this.render_candidate_nodes(node);
    }

    public init_branch(branches: SC_Branch[]) {
        for (let i = 0; i < branches.length; i++) {
            let clone_branch = new SC_Branch(vec2.fromValues(0,0), null);
            Object.assign(clone_branch, branches[i]);
            
            this.m_branch_dict.set(clone_branch.id, clone_branch);
            this.draw_branch(clone_branch);
        }
    }

    public render() {

    }
}

export default PixiCanvas;