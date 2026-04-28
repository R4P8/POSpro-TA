package middleware

import (
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func RoleMiddleware(allowedRoles ...string) func(httprouter.Handle) httprouter.Handle {
	return func(next httprouter.Handle) httprouter.Handle {

		return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

			userClaims, ok := r.Context().Value(UserContextKey).(*JWTClaims)
			if !ok {
				http.Error(w, "unauthorized", http.StatusUnauthorized)
				return
			}

			fmt.Println("ROLE FROM TOKEN:", userClaims.Role)
			fmt.Println("ALLOWED ROLES:", allowedRoles)

			// cek apakah role user ada di allowedRoles
			for _, role := range allowedRoles {
				if userClaims.Role == role {
					next(w, r, ps)
					return
				}
			}

			http.Error(w, "forbidden - insufficient role", http.StatusForbidden)
		}
	}
}
