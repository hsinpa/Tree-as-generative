import { Application, Color, Graphics, GraphicsContext } from "pixi.js";
import { SC_Node } from "../SpaceColonization/SpaceColonization";
import { SC_Branch } from "../SpaceColonization/SC_Branch";
import { DrawLine, DrawRect2D, Drawsphere } from "./PixiHelper";
import { LoopOps } from "../Hsinpa/UtilityFunc";
import { vec2 } from "gl-matrix";

class PixiCanvas {
    private m_pixi_app: Application;

    public get ScreenHeight() { return this.m_pixi_app.canvas.height; }

    public get ScreenWidth() { return this.m_pixi_app.canvas.width; }

    constructor() {
        this.m_pixi_app = new Application();
    }

    public async init_canvas(holder_dom_query: string) {
        let selected_dom = document.querySelector(holder_dom_query);
        await this.m_pixi_app.init({ width: 512, height: 512 })  

        this.m_pixi_app.renderer.background.color = new Color([0.9,0.9,0.9]);

        if (selected_dom != undefined) {
            selected_dom.appendChild(this.m_pixi_app.canvas);
        }

        this.m_pixi_app.ticker.add(this.render.bind(this));
    }

    private render_candidate_leaves(node: SC_Node[]) {
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
        
        if (branch.is_vertices_set && branch.parent.is_vertices_set) {
            
            let branch_rect = DrawRect2D(branch.branch_vertices[0], branch.branch_vertices[1], branch.parent.branch_vertices[0], branch.parent.branch_vertices[1]);
            this.m_pixi_app.stage.addChild(branch_rect);
        } else {
            let branch_line = DrawLine(branch.parent.position, branch.position, branch.child_count);
            this.m_pixi_app.stage.addChild(branch_line);
        }
    }


    public update_leaf(node: SC_Node[]) {
        this.render_candidate_leaves(node);
    }

    public update_branch(branches: SC_Branch[]) {
        for (let i = 0; i < branches.length; i++) {
            // this.draw_branch(branches[i]);
            let clone_branch = new SC_Branch(vec2.fromValues(0,0), null);
            Object.assign(clone_branch, branches[i]);

            this.draw_branch(clone_branch);
        }
    }

    public render() {

    }
}

export default PixiCanvas;