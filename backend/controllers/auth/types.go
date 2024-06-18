package controller

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type RegisterResponse struct {
	Message string `json:"message"`
}
