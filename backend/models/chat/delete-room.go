package chat

import "github.com/lordavader501/chatsphere/models"

func DeleteRoom(roomid string) error {
	_, err := models.DB.Exec("DELETE FROM rooms WHERE room_id = ?", roomid)
	return err
}
