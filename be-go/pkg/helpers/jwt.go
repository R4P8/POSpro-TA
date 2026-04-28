package helpers

import (
	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/pkg/middleware"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(user *entity.User) (string, error) {

	claims := middleware.JWTClaims{
		UserID: int(user.ID_User),
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	secret := []byte(os.Getenv("JWT_SECRET"))

	tokenString, err := token.SignedString(secret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
