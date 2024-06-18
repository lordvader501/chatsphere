package wschat

import (
	"fmt"
	"sync"
)

type Room struct {
	Name      string
	clients   map[*Client]bool
	broadcast chan Message
	mu        sync.Mutex
}

var Rooms = make(map[string]*Room)
var RoomMu sync.Mutex

func (r *Room) Run() {
	for message := range r.broadcast {
		r.mu.Lock()
		for client := range r.clients {
			if client.username != message.Username {
				select {
				case client.send <- message:

				default:
					close(client.send)
					delete(r.clients, client)
				}
			}
		}
		r.mu.Unlock()
	}
}

func (room *Room) BroadcastClientList() {
	room.mu.Lock()
	defer func() {
		room.mu.Unlock()
	}()
	var clients []string
	for client := range room.clients {
		clients = append(clients, client.username)
	}

	clientListMessage := Message{
		Type:    BroadCastClient,
		Message: clients,
	}

	room.broadcast <- clientListMessage
}

func (room *Room) BroadCastJoinOrExitClient(client *Client, msgType MsgType) {
	room.mu.Lock()
	defer func() {
		room.mu.Unlock()
	}()

	var clientListMessage Message
	switch msgType {
	case BroadCastExit:
		clientListMessage = Message{
			Type:    msgType,
			Message: fmt.Sprintf("%v has left the room", client.username),
		}
	case BroadCastJoin:
		clientListMessage = Message{
			Type:    msgType,
			Message: fmt.Sprintf("%v has joined the room", client.username),
		}
	}

	room.broadcast <- clientListMessage
}
