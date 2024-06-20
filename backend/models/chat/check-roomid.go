package chat

import (
	"github.com/lordavader501/chatsphere/models"
)

func GetRoomByID(roomid string) (Room, error) {
	var room Room
	// get first room id from db
	err := models.DB.QueryRow("SELECT room_id, room_name, is_private, created_by FROM rooms WHERE room_id = ?", roomid).Scan(&room.RoomID, &room.RoomName, &room.IsPrivate, &room.CreatedBy)

	return room, err
}
