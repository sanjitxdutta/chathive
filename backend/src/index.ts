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

    socket.on("message", (msg) => {
        try {
            const data = JSON.parse(msg.toString());

            if (data.type === "join-room") {
                const { room } = data;
                user.name = generateUniqueName(room);
                user.room = room;

                console.log(`${user.name} joined room ${room}`);
                socket.send(
                    JSON.stringify({
                        type: "room-joined",
                        room,
                        name: user.name,
                        usersInRoom: users.filter((u) => u.room === room).length,
                    })
                );
            }
        } catch (e) {
            console.error("Invalid message", e);
        }
    });

    socket.on("close", () => {
        users = users.filter((u) => u.id !== user.id);
        console.log(`${user.name} disconnected`);
    });
});

console.log("ChatHive backend running on ws://localhost:8080");
