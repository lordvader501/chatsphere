package auth

import (
	"database/sql"
	"fmt"

	"github.com/lordavader501/chatsphere/models"
)

type User struct {
	ID       string
	Username string
	Email    string
	Password string
	Verified bool
}

func FindUser(identifier string) (*User, error) {
	findUserQuery := "SELECT id, username, email, password, verified FROM users WHERE email = ? OR username = ? OR id = ?"

	var user User

	if err := models.DB.QueryRow(findUserQuery, identifier, identifier, identifier).Scan(&user.ID, &user.Username, &user.Email, &user.Password, &user.Verified); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user with email/username %s not found", identifier)
		}
		return nil, err
	}
	return &user, nil
}
