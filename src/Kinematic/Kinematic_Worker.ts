import { WorkerEventName } from "../SpaceColonization/SC_Static";
import { IWorkerEvent } from "../SpaceColonization/SC_Types";

self.onmessage = (msg) => {
    const event_dict: IWorkerEvent = msg.data;

    console.log('Kinematics: message from main', event_dict);

    switch (event_dict.event) {
        case WorkerEventName.World_Is_Create:

            // postMessage({
            //     'event': WorkerEventName.World_Is_Create,
            //     'data': {
            //         'branch_kd': space_colonization.BranchKD.data,
            //         'leaves': space_colonization.Leaves,
            //         'branches': space_colonization.Branches,
            //     }
            // });

            break;
    }
};