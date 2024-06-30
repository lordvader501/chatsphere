package chat

import (
	"github.com/lordavader501/chatsphere/models"
)

func CheckPrivateRoom(roomID, userID string) (int, error) {
	var count int
	err := models.DB.QueryRow("SELECT COUNT(*) FROM room_users WHERE room_id = ? AND user_id = ?", roomID, userID).Scan(&count)
	return count, err
}
