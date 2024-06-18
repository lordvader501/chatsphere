package auth

import (
	"fmt"
	"regexp"

	"github.com/lordavader501/chatsphere/models"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(unique_id, username, email, password string) (string, bool) {

	if !isEmailValid(email) {
		return "Invalid email format", false
	}
	if !IsUserVerified(email) {
		return "Please verify your Email Id.", false
	}

	if !isUsernameUnique(username) {
		return "Username already exists", false
	}

	if !isEmailUnique(email) {
		return "Email already exists", false
	}

	createUserQuery := `
	INSERT INTO users (id, username, email, password, verification_token, created_at, updated_at) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
	`
	var err error
	new_password, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return fmt.Sprintf("Error while hashing password %s", err), false
	}

	if _, err = models.DB.Exec(createUserQuery, unique_id, username, email, new_password, unique_id); err != nil {
		return fmt.Sprintf("Error while creating user %s", err), false
	}

	return fmt.Sprintln("User created successfully."), true
}

func isEmailValid(email string) bool {
	re := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	return re.MatchString(email)
}

func isUsernameUnique(username string) bool {
	var exists bool
	query := "SELECT EXISTS (SELECT 1 FROM users WHERE username=?)"
	err := models.DB.QueryRow(query, username).Scan(&exists)
	return !exists && err == nil
}

func isEmailUnique(email string) bool {
	var exists bool
	query := "SELECT EXISTS (SELECT 1 FROM users WHERE email=?)"
	err := models.DB.QueryRow(query, email).Scan(&exists)
	return !exists && err == nil
}

func IsUserVerified(identification string) bool {
	var verified bool
	query := "SELECT verified FROM users WHERE email = ? OR username = ?"
	err := models.DB.QueryRow(query, identification, identification).Scan(&verified)
	if err != nil {
		return true

	}
	return verified
}

func VerifyUser(userID string) error {
	query := "UPDATE users SET verified = TRUE, verification_token = NULL WHERE id = ?"
	_, err := models.DB.Exec(query, userID)
	return err
}
