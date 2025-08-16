import { WebSocketServer, WebSocket } from "ws";
import { randomName } from "./utils/names.js";
import { randomUUID } from "crypto";

interface User {
    id: string;
    name: string;
    room: string | null;
    socket: WebSocket;
}

let users: User[] = [];

const wss = new WebSocketServer({ port: 8080 });

function generateUniqueName(room: string | null): string {
    let name: string;
    do {
        name = randomName();
    } while (users.some((u) => u.room === room && u.name === name));
    return name;
}

wss.on("connection", (socket) => {
    const user: User = {
        id: randomUUID(),
        name: generateUniqueName(null),
        room: null,
        socket,
    };

    users.push(user);
    console.log(`${user.name} connected`);

    socket.on("message", (data) => {
        try {
            const msg = JSON.parse(data.toString());

            if (msg.type === "join") {
                user.room = msg.room;
                user.name = generateUniqueName(user.room);

                console.log(`${user.name} joined room: ${user.room}`);

                socket.send(
                    JSON.stringify({
                        type: "welcome",
                        name: user.name,
                        room: user.room,
                        usersInRoom: users.filter((u) => u.room === user.room).length,
                    })
                );
            }
        } catch (err) {
            console.error("Invalid message:", err);
        }
    });

    socket.on("close", () => {
        users = users.filter((u) => u.id !== user.id);
        console.log(`${user.name} disconnected`);
    });
});

console.log("ChatHive backend running on ws://localhost:8080");
