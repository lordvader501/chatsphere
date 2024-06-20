package wschat

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lordavader501/chatsphere/models/chat"
)

func DeleteRoom(w http.ResponseWriter, r *http.Request) {
	var roomid RoomID
	if err := json.NewDecoder(r.Body).Decode(&roomid); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": " bad json"})
		return
	}
	if roomid.RoomID == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid room Id."})
		return
	}
	if err := chat.DeleteRoom(roomid.RoomID); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": fmt.Sprintf("Room Id \"%s\" deleted successfully.", roomid.RoomID)})
}
