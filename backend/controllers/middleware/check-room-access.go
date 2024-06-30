package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lordavader501/chatsphere/models/chat"
)

func CheckRoomAccess() Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			chatId := r.URL.Query().Get("room")
			room, err := chat.GetRoomByID(chatId)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
				return
			}
			userId := r.Header.Get("user_id")
			fmt.Println(room.CreatedBy, userId)
			if room.IsPrivate && room.CreatedBy != userId {
				count, err := chat.CheckPrivateRoom(chatId, userId)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
					return
				}
				if count == 0 {
					w.WriteHeader(http.StatusForbidden)
					json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized access."})
					return
				}
			}

			f(w, r)
		}
	}
}
