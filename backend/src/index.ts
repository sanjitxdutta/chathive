import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import { randomName } from "./utils/names.js";

interface User {
    socket: WebSocket;
    room: string;
    name: string;
}

let allSockets: User[] = [];

function isValidRoomId(id: string): boolean {
    return /^[0-9a-f]{4,32}$/i.test(id);
}

function generateUniqueName(room: string): string {
    let name: string;
    do {
        name = randomName();
    } while (allSockets.some((u) => u.room === room && u.name === name));
    return name;
}

function broadcastToRoom(room: string, message: object, exclude?: WebSocket) {
    const data = JSON.stringify(message);
    allSockets = allSockets.filter((u) => {
        if (u.room !== room || u.socket === exclude) return true;
        if (u.socket.readyState !== WebSocket.OPEN) return false;
        try {
            u.socket.send(data);
            return true;
        } catch {
            return false;
        }
    });
}

const server = http.createServer();
const PORT = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ server });
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

//For Corn-job.org
server.on("request", (req, res) => {
  if (req.url?.startsWith("/health")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        uptime: process.uptime().toFixed(2),
        ts: Date.now()
      })
    );
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ChatHive backend alive");
});


wss.on("connection", (socket) => {

    (socket as any).isAlive = true;
    socket.on("pong", () => ((socket as any).isAlive = true));
    const interval = setInterval(() => {
        if ((socket as any).isAlive === false) {
            console.log("Terminating dead socket");
            return socket.terminate();
        }
        (socket as any).isAlive = false;
        try {
            socket.ping();
        } catch { }
    }, 30000);

    socket.on("message", (raw) => {
        let parsedMessage: any;
        try {
            parsedMessage = JSON.parse(raw.toString());
        } catch {
            console.error("Invalid JSON:", raw.toString());
            return;
        }

        if (parsedMessage.type === "join") {
            let { roomId } = parsedMessage.payload || {};
            if (!roomId) {
                socket.send(JSON.stringify({ type: "error", message: "Missing roomId" }));
                return;
            }

            roomId = String(roomId).toLowerCase();
            if (!isValidRoomId(roomId)) {
                socket.send(
                    JSON.stringify({
                        type: "error",
                        message: "Invalid Room ID. Must be 4–32 hex chars (0-9, a-f).",
                    })
                );
                return;
            }

            allSockets = allSockets.filter((u) => u.socket !== socket);

            const name = generateUniqueName(roomId);
            allSockets.push({ socket, room: roomId, name });

            console.log(`${name} connected to ${roomId}`);

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

            broadcastToRoom(
                roomId,
                {
                    type: "notification",
                    payload: { message: `${name} has joined the room.` },
                },
                socket
            );
        }

        if (parsedMessage.type === "chat") {
            const currentUser = allSockets.find((u) => u.socket === socket);
            if (!currentUser) return;

            broadcastToRoom(currentUser.room, {
                type: "chat",
                payload: {
                    sender: currentUser.name,
                    message: parsedMessage.payload?.message,
                    room: currentUser.room,
                    ts: Date.now(),
                },
            });
        }
    });

    socket.on("close", () => {
        clearInterval(interval);

        const currentUser = allSockets.find((u) => u.socket === socket);
        if (currentUser) {
            console.log(`${currentUser.name} disconnected from ${currentUser.room}`);

            broadcastToRoom(
                currentUser.room,
                {
                    type: "notification",
                    payload: { message: `${currentUser.name} has left the room.` },
                },
                socket
            );
        }

        allSockets = allSockets.filter((u) => u.socket !== socket);
    });
});
