package middleware

import "github.com/julienschmidt/httprouter"

func Protected(handler httprouter.Handle, roles ...string) httprouter.Handle {
	return JWTMiddleware(RoleMiddleware(roles...)(handler))
}
