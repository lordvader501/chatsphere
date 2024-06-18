package wschat

import (
	"fmt"

	"github.com/gorilla/websocket"
)

type Client struct {
	room     *Room
	username string
	conn     *websocket.Conn
	send     chan Message
}

type MsgType uint8

const (
	userMessage     MsgType = 1
	otherMessage    MsgType = 2
	BroadCastClient MsgType = 3
	BroadCastExit   MsgType = 4
	BroadCastJoin   MsgType = 5
)

func (c *Client) ReadMessage() {
	defer func() {
		c.room.mu.Lock()
		delete(c.room.clients, c)
		c.room.mu.Unlock()
		go c.room.BroadCastJoinOrExitClient(c, BroadCastExit)
		go c.room.BroadcastClientList()
		c.conn.Close()
	}()
	for {
		var message Message
		message.Username = c.username

		if err := c.conn.ReadJSON(&message); err != nil {
			fmt.Println(err)
			break
		}

		message.Type = otherMessage
		c.room.broadcast <- message
	}
}

func (c *Client) WriteMessage() {
	defer c.conn.Close()

	for message := range c.send {
		if message.Type == userMessage {
			message.Type = otherMessage
		}
		if err := c.conn.WriteJSON(message); err != nil {
			return
		}
	}
}
