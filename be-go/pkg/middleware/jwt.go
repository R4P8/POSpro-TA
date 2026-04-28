package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/julienschmidt/httprouter"
)

type contextKey string

const UserContextKey contextKey = "user"

// Claims custom
type JWTClaims struct {
	UserID int    `json:"user_id"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// JWTMiddleware validates token
func JWTMiddleware(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "missing authorization header", http.StatusUnauthorized)
			return
		}

		// Expect: Bearer token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			http.Error(w, "invalid authorization format", http.StatusUnauthorized)
			return
		}

		secret := []byte(os.Getenv("JWT_SECRET"))

		token, err := jwt.ParseWithClaims(
			tokenString,
			&JWTClaims{},
			func(token *jwt.Token) (interface{}, error) {
				return secret, nil
			},
		)

		if err != nil || !token.Valid {
			http.Error(w, "invalid or expired token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(*JWTClaims)
		if !ok {
			http.Error(w, "invalid token claims", http.StatusUnauthorized)
			return
		}

		// Inject claims ke context
		ctx := context.WithValue(r.Context(), UserContextKey, claims)

		next(w, r.WithContext(ctx), ps)
	}
}
