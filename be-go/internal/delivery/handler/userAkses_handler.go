package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/service"

	"github.com/julienschmidt/httprouter"
)

type UserAksesHandler struct {
	service service.UserAksesService
}

func NewUserAksesHandler(service service.UserAksesService) *UserAksesHandler {
	return &UserAksesHandler{service: service}
}

func (h *UserAksesHandler) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var user entity.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.Create(r.Context(), &user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	user.Password = ""

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(user)
}

func (h *UserAksesHandler) GetAll(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	users, err := h.service.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	for i := range users {
		users[i].Password = ""
	}

	json.NewEncoder(w).Encode(users)
}

func (h *UserAksesHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := strconv.ParseInt(ps.ByName("id"), 10, 64)

	user, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	user.Password = ""
	json.NewEncoder(w).Encode(user)
}

func (h *UserAksesHandler) Update(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, _ := strconv.ParseInt(ps.ByName("id"), 10, 64)

	var user entity.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	user.ID_User = id

	// Ambil data lama untuk preserve password
	existing, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Kalau password tidak dikirim dari FE, pakai password lama
	if user.Password == "" {
		user.Password = existing.Password
	}

	if err := h.service.Update(r.Context(), &user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "User updated successfully",
	})
}
