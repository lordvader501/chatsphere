package chat

import "github.com/lordavader501/chatsphere/models"

func AddUserToPrivateRoom(roomID, identification string) error {
	var userID string
	if err := models.DB.QueryRow("SELECT id FROM users WHERE username = ? OR email = ?", identification, identification).Scan(&userID); err != nil {
		return err
	}
	_, err := models.DB.Exec("INSERT INTO room_users (room_id, user_id) VALUES (?, ?)", roomID, userID)
	return err
}
