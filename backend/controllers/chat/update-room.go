package wschat

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lordavader501/chatsphere/models/chat"
)

func UpdateRoom(w http.ResponseWriter, r *http.Request) {
	var room chat.RoomDetails
	if err := json.NewDecoder(r.Body).Decode(&room); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": " bad json"})
		return
	}
	if room.RoomID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid room Id."})
		return
	}
	if room.RoomName == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid room name."})
		return
	}
	userId := r.Header.Get("user_id")
	if err := chat.UpdateRoom(room, userId); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": fmt.Sprintf("Room Id \"%s\" updated successfully.", room.RoomID)})
}
