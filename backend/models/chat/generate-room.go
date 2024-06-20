package chat

import "github.com/lordavader501/chatsphere/models"

func CreateRoom(roomid Room) error {
	_, err := models.DB.Exec("INSERT INTO rooms (room_id, room_name, is_private, created_by) VALUES (?, ?, ?, ?)", roomid.RoomID, roomid.RoomName, roomid.IsPrivate, roomid.CreatedBy)
	return err
}
