package wschat

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lordavader501/chatsphere/models/chat"
)

func ListRooms(w http.ResponseWriter, r *http.Request) {
	userId := r.Header.Get("user_id")
	rooms, err := chat.GetRooms(userId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	fmt.Println(rooms)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"rooms": rooms})
}
