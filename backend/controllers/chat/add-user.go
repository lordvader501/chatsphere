package wschat

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lordavader501/chatsphere/models/chat"
)

type AddUserRequest struct {
	Username string `json:"username"`
	RoomID   string `json:"roomid"`
}

func AddUserToPrivateRoom(w http.ResponseWriter, r *http.Request) {
	var body AddUserRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("bad request %s", err)})
		return
	}

	if err := chat.AddUserToPrivateRoom(body.RoomID, body.Username); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error."})
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "User Added to private chat"})
}
