import { Application, Color, Graphics, GraphicsContext } from "pixi.js";
import { SC_Node } from "../SpaceColonization/SpaceColonization";

class PixiCanvas {
    private m_pixi_app: Application;

    private m_leaf_nodes: SC_Node[] = [];

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
            
            let leaf_graphic = new Graphics()
            .circle(node_pos[0], node_pos[1], 2)
            .fill(0xff0000);
        
            this.m_pixi_app.stage.addChild(leaf_graphic);

        }
    }

    public update_leaf(node: SC_Node[]) {
        this.m_leaf_nodes = node;
        this.render_candidate_leaves(this.m_leaf_nodes);
    }

    public render() {

    }
}

export default PixiCanvas;