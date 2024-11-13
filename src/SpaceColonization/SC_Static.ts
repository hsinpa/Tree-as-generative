import Color from "../Hsinpa/Color";

export const ImagesPath = Object.freeze({
    leave_01 : "./assets/textures/leaf-01.png"
});

export const Config = Object.freeze({
    Branch_Length: 20,

    Leaf_ThinBranch_Rate: 0.5,
    Leaf_Endpoint_Rate: 0.8,

    Leaf_Interact_Color: new Color(255, 10, 10, 0.9)
});

export const WorkerEventName = Object.freeze({
    World_Config: 'world_config',
    World_Is_Create: 'world_is_create',

    WorldUpdate: 'world_update',
    MouseInputStart: 'mouse_input_start',
    MouseInputEnd: 'mouse_input_end',


});