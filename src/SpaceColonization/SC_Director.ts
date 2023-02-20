import { vec2 } from "gl-matrix";
import { MersenneTwister19937, Random } from "random-js";
import Color from "../Hsinpa/Color";
import { InputHandler, MouseEvent } from "../Hsinpa/Input/InputHandler";
import SimpleCanvas from "../Hsinpa/SimpleCanvas";
import { RelativeAngle } from "../Hsinpa/UtilityFunc";
import WebglResource from "../Hsinpa/WebglResource";
import { Kinematics } from "../Kinematic/Kinematic";
import { SC_Branch } from "./SC_Branch";
import SC_Canvas, {ConstructionType} from "./SC_Canvas";
import {ImagesPath, Config} from './SC_Static';
import { Mode } from "./SC_Types";
import { SpaceColonization } from "./SpaceColonization";

//Main entry point
export default class SC_Director {
    private m_space_colonization : SpaceColonization;
    private m_sc_canvas : SC_Canvas;
    private m_simple_canvas: SimpleCanvas;
    private m_rand_engine : Random;
    private m_resource: WebglResource;
    private m_inputHandler : InputHandler;
    private m_kinematics : Kinematics;

    private m_mouse_position: vec2;
    private m_mode: Mode = Mode.Idle;
    public get mode() { return this.m_mode; }

    private m_interact_branch: SC_Branch = null;

    constructor(canvas_dom_query: string, seed?: number) {
        this.m_rand_engine = this.get_random_engine(seed);
        this.m_space_colonization = new SpaceColonization(20, 100, this.m_rand_engine);

        this.m_mouse_position = vec2.create();
        this.m_inputHandler = new InputHandler();
        this.m_resource = new WebglResource();
        this.m_kinematics = new Kinematics();
        this.m_simple_canvas = new SimpleCanvas(canvas_dom_query);
        this.m_sc_canvas = new SC_Canvas(this.m_simple_canvas, this.m_space_colonization, this.m_rand_engine, this.m_resource);

        this.m_simple_canvas.Dom.addEventListener('mousemove', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Hover); } );
        this.m_simple_canvas.Dom.addEventListener('mousedown', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Down); } );
        this.m_simple_canvas.Dom.addEventListener('mouseup', e => { this.on_mouse_event(e.clientX, e.clientY, MouseEvent.Up); } );

        this.process_preparation_stage();
    }

    private async process_preparation_stage() {
        await this.m_resource.GetImage(ImagesPath.leave_01);

        window.requestAnimationFrame(this.update.bind(this));
    }

    private update() {
        //this._inputHandler.OnUpdate();
        
        if (this.m_sc_canvas.construct_flag != ConstructionType.Complete) {
            this.m_sc_canvas.construct_on_the_fly();            
        } else {
            this.m_sc_canvas.render(this.on_ctrl_point_draw.bind(this));
        }

        window.requestAnimationFrame(this.update.bind(this));
    }

    private get_random_engine(seed?: number) : Random {
        if (seed == undefined) {
            return new Random(MersenneTwister19937.autoSeed());
        } else
            return new Random(MersenneTwister19937.seed(seed));
    }

    private on_mouse_event(mouse_x: number, mouse_y: number, mouse_event: MouseEvent) {
        this.m_mouse_position[0] = mouse_x;
        this.m_mouse_position[1] = mouse_y;

        if (mouse_event == MouseEvent.Up) this.on_mouse_up();
        if (mouse_event == MouseEvent.Down) this.on_mouse_down();

        this.on_mouse_move();
    }

    private on_mouse_up() {
        this.m_mode = Mode.Idle;
        this.m_interact_branch = null;

        this.m_space_colonization.rebuild_kd_tree();
    }

    private on_mouse_down() {
        let kd_branch : KDBush<SC_Branch> = this.m_space_colonization.BranchKD;
        let branches = this.m_space_colonization.Branches;
        let filter_branches = kd_branch.within(this.m_mouse_position[0], this.m_mouse_position[1], 15);
        let filter_lens = filter_branches.length;

        for (let i = 0; i < filter_lens; i++) {
            let process_branch = branches[ filter_branches[i] ];

            if (process_branch.is_valid_endpoint) {
                this.m_mode = Mode.Interaction;
                this.m_interact_branch = process_branch;
            }
        }
    }

    private on_mouse_move() {
        if (this.m_mode == Mode.Idle || this.m_interact_branch == null) return;

        this.m_kinematics.Process(this.m_interact_branch, this.m_mouse_position);
        // this.m_interact_branch.position[0] = this.m_mouse_position[0];
        // this.m_interact_branch.position[1] = this.m_mouse_position[1];
    }


    private on_ctrl_point_draw(branch: SC_Branch) {
        if (branch == this.m_interact_branch) {
            branch.style.copy_value(Config.Leaf_Interact_Color);

            return;
        }
        
        let distance = vec2.distance(branch.position, this.m_mouse_position);
        
        let interact_avail_dist = 30;
        if (distance < interact_avail_dist && this.mode == Mode.Idle) {
            console.log("Hello friend");

            let new_color = Color.lerp(branch.original_style, Config.Leaf_Interact_Color, 1 - (distance / interact_avail_dist) );
            branch.style = new_color;
        } else {
            branch.style.copy_value(branch.original_style);
        }       
    }
}