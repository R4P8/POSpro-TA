package handler

import (
	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/service"
	"Be-ManagementProduct/pkg/middleware"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

type UserHandler struct {
	service service.UserService
}

func NewUserHandler(s service.UserService) *UserHandler {
	return &UserHandler{service: s}
}

func (h *UserHandler) Register(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var req struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Role     string `json:"role"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Basic validation
	if req.FullName == "" || req.Email == "" || req.Role == "" || req.Password == "" {
		http.Error(w, "all fields are required", http.StatusBadRequest)
		return
	}

	user := entity.User{
		FullName: req.FullName,
		Email:    req.Email,
		Role:     req.Role,
		Password: req.Password,
	}

	err := h.service.Register(r.Context(), &user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "user registered successfully",
	})
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	var req struct {
		Email    string `json:"email"`
		Role     string `json:"role"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user, token, err := h.service.Login(r.Context(), req.Email, req.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":    user.ID_User,
		"email": user.Email,
		"role":  user.Role,
		"token": token,
	})
}

func (h *UserHandler) Profile(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	claims, ok := r.Context().Value(middleware.UserContextKey).(*middleware.JWTClaims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := h.service.GetProfile(r.Context(), int64(claims.UserID))
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	// jangan kirim password
	user.Password = ""

	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	id, _ := strconv.ParseInt(ps.ByName("id"), 10, 64)

	user, err := h.service.GetProfile(r.Context(), id)
	if err != nil {
		http.Error(w, "user not found", http.StatusNotFound)
		return
	}

	user.Password = "" // jangan kirim password

	json.NewEncoder(w).Encode(user)
}

func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	id, _ := strconv.ParseInt(ps.ByName("id"), 10, 64)

	var req entity.User
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	req.ID_User = id

	updatedUser, err := h.service.UpdateProfile(r.Context(), &req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	updatedUser.Password = "" // jangan kirim password

	json.NewEncoder(w).Encode(updatedUser)
}

func (h *UserHandler) DeleteAccount(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	id, _ := strconv.ParseInt(ps.ByName("id"), 10, 64)

	deletedUser, err := h.service.DeleteAccount(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	deletedUser.Password = ""

	json.NewEncoder(w).Encode(deletedUser)
}
