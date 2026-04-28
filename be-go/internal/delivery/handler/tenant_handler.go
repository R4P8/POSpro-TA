package handler

import (
	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/service"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

type TenantHandler struct {
	service service.TenantService
}

func NewTenantHandler(service service.TenantService) *TenantHandler {
	return &TenantHandler{service: service}
}

func (h *TenantHandler) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	var tenant entity.Tenant

	if err := json.NewDecoder(r.Body).Decode(&tenant); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := h.service.Create(r.Context(), &tenant)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(tenant)
}

func (h *TenantHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	tenant, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "tenant not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(tenant)
}

func (h *TenantHandler) GetAll(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	tenants, err := h.service.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tenants)
}

func (h *TenantHandler) Update(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var tenant entity.Tenant
	if err := json.NewDecoder(r.Body).Decode(&tenant); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	tenant.IDTenant = id

	err = h.service.Update(r.Context(), &tenant)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tenant)
}

func (h *TenantHandler) Delete(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	err = h.service.Delete(r.Context(), id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
