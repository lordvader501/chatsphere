package controller

import (
	"encoding/json"
	"net/http"

	"github.com/lordavader501/chatsphere/models/auth"
)

func VerifyUser(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("Token is required")
		return
	}

	user, err := auth.FindUser(token)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error finding user")
		return
	}
	if user.Verified {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("User already verified")
		return
	}
	if err := auth.VerifyUser(token); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode("Error verifying user")
		return
	}

	w.Write([]byte(`{"message": "User verified successfully"}`))
}
