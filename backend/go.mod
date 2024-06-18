module github.com/lordavader501/chatsphere

go 1.22.4

require (
	github.com/go-sql-driver/mysql v1.8.1
	github.com/google/uuid v1.6.0
	github.com/gorilla/sessions v1.3.0
	github.com/gorilla/websocket v1.5.3
	github.com/joho/godotenv v1.5.1
	golang.org/x/crypto v0.24.0
	gopkg.in/gomail.v2 v2.0.0-20160411212932-81ebce5c23df
)

require (
	filippo.io/edwards25519 v1.1.0 // indirect
	github.com/gorilla/securecookie v1.1.2 // indirect
	gopkg.in/alexcesaro/quotedprintable.v3 v3.0.0-20150716171945-2caba252f4dc // indirect
)

replace github.com/lordavader501/chatsphere/module => ./models
