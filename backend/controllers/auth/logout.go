package controller

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/lordavader501/chatsphere/models"
)

func LogoutUser(w http.ResponseWriter, r *http.Request) {
	session, _ := models.Store.Get(r, os.Getenv("SESSION_NAME"))

	session.Options.MaxAge = -1
	session.Save(r, w)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Logout successful."})
}
