package chat

import "github.com/lordavader501/chatsphere/models"

func GetRooms(userId string) ([]RoomDetails, error) {
	rows, err := models.DB.Query("SELECT room_id, room_name, is_private FROM rooms where created_by = ?", userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	rooms := []RoomDetails{}
	for rows.Next() {
		var room RoomDetails
		if err := rows.Scan(&room.RoomID, &room.RoomName, &room.IsPrivate); err != nil {
			return nil, err
		}
		rooms = append(rooms, room)
	}
	return rooms, nil
}
