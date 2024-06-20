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

	handler := http.NewServeMux()

	handler.HandleFunc("/register", middleware.Chain(controller.RegisterUser, middleware.Post()))
	handler.HandleFunc("/login", middleware.Chain(controller.LoginUser, middleware.Post()))
	handler.HandleFunc("/verify", middleware.Chain(controller.VerifyUser, middleware.Get()))
	handler.HandleFunc("/logout", middleware.Chain(controller.LogoutUser, middleware.Get(), middleware.CheckLogin()))
	handler.HandleFunc("/request-reset-password", middleware.Chain(controller.RequestResetPassword, middleware.Post()))
	handler.HandleFunc("/reset-password", middleware.Chain(controller.ResetPassword, middleware.Post()))
	handler.HandleFunc("/chat", middleware.Chain(wschat.HandleWSConnection, middleware.Get(), middleware.CheckLogin()))
	handler.HandleFunc("/create-room", middleware.Chain(wschat.CreateRoom, middleware.Post(), middleware.CheckLogin()))
	handler.HandleFunc("/check-roomid", middleware.Chain(wschat.CheckRoomID, middleware.Post(), middleware.CheckLogin()))
	handler.HandleFunc("/list-rooms", middleware.Chain(wschat.ListRooms, middleware.Get(), middleware.CheckLogin()))
	handler.HandleFunc("/delete-room", middleware.Chain(wschat.DeleteRoom, middleware.Post(), middleware.CheckLogin()))
	handler.HandleFunc("/update-room", middleware.Chain(wschat.UpdateRoom, middleware.Post(), middleware.CheckLogin()))

	mwhandler := middleware.Chain(handler.ServeHTTP, middleware.CORS())
	log.Fatal(http.ListenAndServe("localhost:8080", mwhandler))
}
