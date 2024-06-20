package chat

import "github.com/lordavader501/chatsphere/models"

func UpdateRoom(room RoomDetails, userId string) error {
	_, err := models.DB.Exec("UPDATE rooms SET room_name = ?, is_private = ? WHERE room_id = ? AND created_by = ?",
		room.RoomName, room.IsPrivate, room.RoomID, userId)
	return err
}
