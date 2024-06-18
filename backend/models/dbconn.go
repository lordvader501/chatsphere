package models

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
)

var DB *sql.DB

var Store *sessions.CookieStore

func InitDBConn() {
	cfg := mysql.Config{
		User:      os.Getenv("DBUSER"),
		Passwd:    os.Getenv("DBPASS"),
		Net:       "tcp",
		Addr:      os.Getenv("DBADDR"),
		DBName:    os.Getenv("DBNAME"),
		ParseTime: true,
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		fmt.Println("Error whild connecting to mysql!!!")
	}

	if err := db.Ping(); err != nil {
		fmt.Println("Error pinging database!!!")
	} else {
		fmt.Println("DB connection successfull.")
	}

	DB = db
	userTableQuery := `
		CREATE TABLE IF NOT EXISTS users (
			id CHAR(36) PRIMARY KEY,
			username VARCHAR(50) UNIQUE NOT NULL,
			email VARCHAR(255) UNIQUE NOT NULL,
			password VARCHAR(255) NOT NULL,
			verified BOOLEAN DEFAULT FALSE,
			verification_token CHAR(36),
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		);
	`
	passResetTableQuery := `
		CREATE TABLE IF NOT EXISTS pass_reset (
			user_id CHAR(36) UNIQUE NOT NULL,
			token CHAR(36) PRIMARY KEY,
			expiry TIMESTAMP NOT NULL,
			FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
		);
	`

	if _, err := db.Exec(userTableQuery); err != nil {
		fmt.Println("error in creation of table user.", err)
	}
	if _, err := db.Exec(passResetTableQuery); err != nil {
		fmt.Println("error in creation of table pass reset.", err)
	}

	Store = sessions.NewCookieStore([]byte(os.Getenv("SECRET_KEY")))
	Store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
	}
}
