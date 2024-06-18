package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/joho/godotenv"
	controller "github.com/lordavader501/chatsphere/controllers/auth"
	wschat "github.com/lordavader501/chatsphere/controllers/chat"
	"github.com/lordavader501/chatsphere/controllers/middleware"
	"github.com/lordavader501/chatsphere/models"
)

func main() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("Could not load env!!!")
	}
	models.InitDBConn()

	http.HandleFunc("/register", middleware.Chain(controller.RegisterUser, middleware.Post()))
	http.HandleFunc("/login", middleware.Chain(controller.LoginUser, middleware.Post()))
	http.HandleFunc("/verify", middleware.Chain(controller.VerifyUser, middleware.Get()))
	http.HandleFunc("/logout", middleware.Chain(controller.LogoutUser, middleware.Get(), middleware.CheckLogin()))
	http.HandleFunc("/request-reset-password", middleware.Chain(controller.RequestResetPassword, middleware.Post()))
	http.HandleFunc("/reset-password", middleware.Chain(controller.ResetPassword, middleware.Post()))
	http.HandleFunc("/chat", middleware.Chain(wschat.HandleWSConnection, middleware.Get(), middleware.CheckLogin()))

	log.Fatal(http.ListenAndServe("localhost:8080", nil))
}
