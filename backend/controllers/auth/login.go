package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/lordavader501/chatsphere/models"
	"github.com/lordavader501/chatsphere/models/auth"
	"golang.org/x/crypto/bcrypt"
)

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var cred LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&cred); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": fmt.Sprintf("bad request %s", err)})
		return
	}
	if cred.Username == "" || cred.Password == "" {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Please provide a valid username/email or password"})
		return
	}

	user, err := auth.FindUser(cred.Username)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}
	if !user.Verified {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Please verify your account!"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(cred.Password)); err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Please provide the valid password."})
		return
	}

	session, _ := models.Store.Get(r, os.Getenv("SESSION_NAME"))
	session.Values["user_id"] = user.ID
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400,
		HttpOnly: true,
	}
	session.Save(r, w)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful", "username": user.Username})
}
