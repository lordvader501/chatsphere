package auth

import (
	"fmt"
	"time"

	"github.com/lordavader501/chatsphere/models"
)

func StoreResetToken(userId, token string) error {
	expiry := time.Now().Add(1 * time.Hour) // Token valid for 1 hour
	_, err := models.DB.Exec("INSERT INTO pass_reset (user_id, token, expiry) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE token=?, expiry=?", userId, token, expiry, token, expiry)
	return err
}

type ResetUser struct {
	UserID string    `db:"user_id"`
	Expiry time.Time `db:"expiry"`
}

func ValidateResetToken(token string) (string, error) {
	// var userID string
	// var expiry time.Time

	var user ResetUser
	err := models.DB.QueryRow("SELECT user_id, expiry FROM pass_reset WHERE token = ?", token).Scan(&user.UserID, &user.Expiry)
	if err != nil {
		return "", fmt.Errorf("no user found. %s", err)
	}
	if time.Now().After(user.Expiry) {
		return "", fmt.Errorf("token expired")
	}
	return user.UserID, nil
}

func UpdateUserPassword(userId, password string) error {
	_, err := models.DB.Exec("UPDATE users SET password = ? WHERE id = ?", password, userId)
	return err
}

func DeleteResetToken(userId string) error {
	query := `DELETE FROM pass_reset WHERE user_id = ?`
	_, err := models.DB.Exec(query, userId)
	if err != nil {
		return err
	}
	return nil
}
