import Color from "../Hsinpa/Color";

export const ImagesPath = Object.freeze({
    leave_01 : "./assets/textures/leaf_1.png",
    leave_02 : "./assets/textures/leaf_2.png",
    leave_03 : "./assets/textures/leaf_3.png",
    leave_04 : "./assets/textures/leaf_4.png",
    leave_05 : "./assets/textures/leaf_5.png",
    leave_06 : "./assets/textures/leaf_6.png",
    leave_07 : "./assets/textures/leaf_7.png",
    leave_08 : "./assets/textures/leaf_8.png",
    leave_09 : "./assets/textures/leaf_9.png",
});

export const Leaf_Textures = [ImagesPath.leave_01, ImagesPath.leave_02, ImagesPath.leave_03,
    ImagesPath.leave_04, ImagesPath.leave_05, ImagesPath.leave_06,
    ImagesPath.leave_07, ImagesPath.leave_08, ImagesPath.leave_09]

export const Config = Object.freeze({
    Branch_Length: 20,

    Leaf_ThinBranch_Rate: 0.5,
    Leaf_Endpoint_Rate: 0.8,

    Leaf_Interact_Color: new Color(20, 20, 255, 1)
});

export const WorkerEventName = Object.freeze({
    World_Config: 'world_config',
    World_Is_Create: 'world_is_create',

    WorldUpdate: 'world_update',
    ModeInteraction: 'mode_interaction',
});