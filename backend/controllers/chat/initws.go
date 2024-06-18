package wschat

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/lordavader501/chatsphere/models/auth"
)

var Upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:    1024,
	WriteBufferSize:   1024,
	EnableCompression: true,
}

type Message struct {
	Type     MsgType     `json:"type"`
	Message  interface{} `json:"message"`
	Username string      `json:"username"`
}

func HandleWSConnection(w http.ResponseWriter, r *http.Request) {
	roomName := r.URL.Query().Get("room")
	if roomName == "" {
		http.Error(w, "Room name is required", http.StatusBadRequest)
		return
	}

	conn, err := Upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	RoomMu.Lock()
	room, ok := Rooms[roomName]
	if !ok {
		room = &Room{
			Name:      roomName,
			clients:   make(map[*Client]bool),
			broadcast: make(chan Message, 100),
		}
		Rooms[roomName] = room
		go room.Run()
	}
	RoomMu.Unlock()
	user, err := auth.FindUser(r.Header.Get("user_id"))
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	client := &Client{
		room:     room,
		conn:     conn,
		send:     make(chan Message, 10),
		username: user.Username,
	}
	room.mu.Lock()
	room.clients[client] = true
	room.mu.Unlock()

	go room.BroadcastClientList()
	go room.BroadCastJoinOrExitClient(client, BroadCastJoin)
	go client.ReadMessage()
	go client.WriteMessage()
}
