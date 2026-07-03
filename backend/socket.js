import { Server } from "socket.io";
import client from "./common/redis.js";
import { createAdapter } from "@socket.io/redis-adapter";

const subClient = client.duplicate();

if (!subClient.isOpen) {
    await subClient.connect();
}

const SocketSingleton = {
    io: null,

    configure(server) {
        if (this.io) return; // prevent re-init in cluster

        this.io = new Server(server);

        this.io.adapter(createAdapter(client, subClient));
    }
};

// const SocketSingleton = {
//     io: null,

//     async configure(server) {
//         if (!subClient.isOpen) {
//     await subClient.connect();
// }

//         this.io = new Server(server);

//         this.io.adapter(createAdapter(client, subClient));

//         this.io.on("connection", (socket) => {
//             console.log(`Client connected: ${socket.id}`);
//         });
//     }
// };

export default SocketSingleton;