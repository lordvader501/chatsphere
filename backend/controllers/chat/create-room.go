package wschat

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"github.com/lordavader501/chatsphere/models/chat"
)

type NewRoom struct {
	RoomName  string `json:"roomname"`
	IsPrivate bool   `json:"is_private"`
}

func CreateRoom(w http.ResponseWriter, r *http.Request) {
	var room chat.Room
	var newroom NewRoom

	if err := json.NewDecoder(r.Body).Decode(&newroom); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": " bad json"})
		return
	}
	if newroom.RoomName == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid room name."})
		return
	}
	room.IsPrivate = newroom.IsPrivate
	room.RoomName = newroom.RoomName
	roomid := strings.Join(strings.Split(uuid.NewString(), "-"), "")[:10]
	roomid = roomid[:3] + "-" + roomid[3:7] + "-" + roomid[7:]
	room.RoomID = roomid
	room.CreatedBy = r.Header.Get("user_id")

	if err := chat.CreateRoom(room); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Room created successfully.", "roomid": roomid})
}
