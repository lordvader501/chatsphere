package wschat

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/lordavader501/chatsphere/models/chat"
)

type RoomID struct {
	RoomID string `json:"roomid"`
}

func CheckRoomID(w http.ResponseWriter, r *http.Request) {
	var roomid RoomID
	if err := json.NewDecoder(r.Body).Decode(&roomid); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid room data"})
		return
	}

	if roomid.RoomID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Room ID is required"})
		return
	}
	tempRoomId := strings.Join(strings.Split(roomid.RoomID, "-"), "")
	if len(tempRoomId) != 10 {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode((map[string]string{"error": "Room Id must be of format \"xxx-xxxx-xxx\" or \"xxxxxxxxxx\"."}))
		return
	}
	roomid.RoomID = tempRoomId[:3] + "-" + tempRoomId[3:7] + "-" + tempRoomId[7:]

	if _, err := chat.GetRoomByID(roomid.RoomID); err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("Room Id not found. No room with id  \"%s\" exist", roomid.RoomID)})
		return
	}

	w.WriteHeader(http.StatusOK)
}
