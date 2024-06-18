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
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)

type ResetPasswordRequest struct {
	Email string `json:"email"`
}

func RequestResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	user, err := auth.FindUser(req.Email)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	token := uuid.NewString()

	if err := auth.StoreResetToken(user.ID, token); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to store reset token"})
		return
	}

	if err := sendResetPasswordMail(req.Email, token); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to send email"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Reset email sent"})
}

type PasswordReset struct {
	Newpassword string `json:"new_password"`
}

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	var new_password PasswordReset
	if err := json.NewDecoder(r.Body).Decode(&new_password); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	userID, err := auth.ValidateResetToken(token)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(new_password.Newpassword), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to hash password"})
		return
	}

	if err := auth.UpdateUserPassword(userID, string(hashedPassword)); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update password"})
		return
	}

	if err := auth.DeleteResetToken(userID); err != nil {
		fmt.Println("Error in deleting reset token!!!")
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Password reset successfully"})
}

func sendResetPasswordMail(email, token string) error {
	tmplPath := filepath.Join("templates", "email", "reset-pass-mail.html")
	tmpl, err := template.ParseFiles(tmplPath)
	if err != nil {
		return fmt.Errorf("error parsing email template: %w", err)
	}

	resetPasswordLink := fmt.Sprintf("http://localhost:8080/reset-password?token=%s", token)

	data := struct {
		ResetPasswordLink string
	}{
		ResetPasswordLink: resetPasswordLink,
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
