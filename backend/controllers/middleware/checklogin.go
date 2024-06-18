package middleware

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/lordavader501/chatsphere/models"
)

func CheckLogin() Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			session, err := models.Store.Get(r, os.Getenv("SESSION_NAME"))

			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
				return
			}

			userID := session.Values["user_id"]

			if userID == nil {
				w.WriteHeader(http.StatusUnauthorized)
				json.NewEncoder(w).Encode(map[string]string{"error": "Please signin."})
				return
			}
			r.Header.Set("user_id", userID.(string))
			f(w, r)
		}
	}
}
