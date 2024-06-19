package middleware

import (
	"net/http"
	"os"
)

func CORS() Middleware {
	return func(f http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", os.Getenv("ORIGIN_HOST"))
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
			// w.Header().Set("Access-Control-Allow-Headers", "*")
			w.Header().Set("Access-Control-Allow-Credentials", "true")

			f(w, r)
		}
	}
}
