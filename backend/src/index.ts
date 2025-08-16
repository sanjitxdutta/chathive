import { WebSocketServer, WebSocket } from "ws";
import { randomName } from "./utils/names.js";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
    name: string;
}

let allSockets: User[] = [];

function isValidRoomId(id: string): boolean {
    return /^[0-9a-f]{4,32}$/.test(id);
}

function generateUniqueName(room: string): string {
    let name: string;
    do {
        name = randomName();
    } while (allSockets.some((u) => u.room === room && u.name === name));
    return name;
}

function broadcastToRoom(room: string, message: any, excludeSocket?: WebSocket) {
    allSockets.forEach((user) => {
        if (user.room === room && user.socket !== excludeSocket) {
            user.socket.send(JSON.stringify(message));
        }
    });
}

wss.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("message", (message) => {
        let parsedMessage;

        try {
            parsedMessage = JSON.parse(message.toString());
        } catch (err) {
            console.error("Invalid JSON:", message.toString());
            return;
        }

        if (parsedMessage.type === "join") {
            const { roomId } = parsedMessage.payload;

            if (!roomId || !isValidRoomId(roomId)) {
                socket.send(
                    JSON.stringify({
                        type: "error",
                        message: "Invalid Room ID. Must be hex (4–32 chars, only 0-9a-f).",
                    })
                );
                return;
            }

            const name = generateUniqueName(roomId);
            allSockets.push({ socket, room: roomId, name });

            console.log(`${name} joined room: ${roomId}`);

            socket.send(
                JSON.stringify({
                    type: "welcome",
                    payload: {
                        name,
                        room: roomId,
                        usersInRoom: allSockets.filter((u) => u.room === roomId).length,
                    },
                })
            );

            broadcastToRoom(roomId, {
                type: "notification",
                payload: { message: `${name} has joined the room.` },
            }, socket);
        }

        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find((x) => x.socket === socket);

            if (!currentUser) return;

            broadcastToRoom(currentUser.room, {
                type: "chat",
                payload: {
                    sender: currentUser.name,
                    message: parsedMessage.payload.message,
                    room: currentUser.room,
                },
            }, socket);
        }
    });

    socket.on("close", () => {
        const currentUser = allSockets.find((u) => u.socket === socket);
        if (currentUser) {
            console.log(`${currentUser.name} disconnected from room: ${currentUser.room}`);

            broadcastToRoom(currentUser.room, {
                type: "notification",
                payload: { message: `${currentUser.name} has left the room.` },
            }, socket);
        }
        allSockets = allSockets.filter((user) => user.socket !== socket);
    });
});

console.log("ChatHive backend running on ws://localhost:8080");
