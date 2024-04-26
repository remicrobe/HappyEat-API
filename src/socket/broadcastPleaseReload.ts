import {Index} from "../index";

export function broadcastPleaseReload() {
    Index.io.to("connectedUsers").emit("reloadRestaurants");
}