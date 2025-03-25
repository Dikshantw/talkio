import WebSocket, { RawData, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

interface User {
	socket: WebSocket,
	room: string
}

const users: User[] = []
wss.on("connection", (socket) => {
	socket.on("error", console.error);

	socket.on("message", (data: RawData) => {
		const message = typeof data === "string" ? data : data.toString();
		const parsedData = JSON.parse(message);
		console.log(parsedData)

		switch (parsedData.type) {
			case 'join':
				users.push({
					socket,
					room: parsedData.roomId
				})
				break;
			case 'chat':
				let currentUserRoom = null;
				for(let i=0; i<users.length; i++){
					if(users[i].socket === socket){
						currentUserRoom = users[i].room
					}
				}

				for(let i=0; i<users.length; i++){
					if(users[i].room === currentUserRoom){
						users[i].socket.send(parsedData.message)
					}
				}
			default:
				break;
		}
	});
});
