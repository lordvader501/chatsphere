package chat

type Room struct {
	RoomID    string
	RoomName  string
	IsPrivate bool
	CreatedBy string
}

type RoomDetails struct {
	RoomID    string `json:"roomid"`
	RoomName  string `json:"roomname"`
	IsPrivate bool   `json:"is_private"`
}
