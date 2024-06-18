package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"text/template"

	"github.com/google/uuid"
	"github.com/lordavader501/chatsphere/models/auth"
	"gopkg.in/gomail.v2"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {

	var user RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(ErrorResponse{Error: fmt.Sprintf("Bad Request %s", err)})
		return
	}

	unique_id := uuid.NewString()
	message, success := auth.CreateUser(unique_id, user.Username, user.Email, user.Password)
	if !success {
		if message == "Please verify your Email Id." {
			if user, err := auth.FindUser(user.Email); err == nil {
				unique_id = user.ID
			}
			if err := sendVerificationEmail(user.Email, unique_id); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				json.NewEncoder(w).Encode(ErrorResponse{Error: "Error sending verification email. " + err.Error()})
				return
			}
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: message})
		return
	}

	if err := sendVerificationEmail(user.Email, unique_id); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Error sending verification email"})
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(RegisterResponse{Message: message})
}

func sendVerificationEmail(email, token string) error {
	tmplPath := filepath.Join("templates", "email", "verification-mail.html")
	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		return fmt.Errorf("error parsing email template: %w", err)
	}

	verificationLink := fmt.Sprintf("http://localhost:8080/verify?token=%s", token)

	data := struct {
		VerificationLink string
	}{
		VerificationLink: verificationLink,
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, data); err != nil {
		return fmt.Errorf("error executing email template: %w", err)
	}

	m := gomail.NewMessage()
	m.SetHeader("From", os.Getenv("EMAIL_FROM"))
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Account Verification")
	m.SetBody("text/html", body.String())
	d := gomail.NewDialer("smtp.gmail.com", 587, os.Getenv("EMAIL_FROM"), os.Getenv("EMAIL_PASS"))

	return d.DialAndSend(m)

}
