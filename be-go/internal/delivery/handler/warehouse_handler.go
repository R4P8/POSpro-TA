package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/service"

	"github.com/julienschmidt/httprouter"
)

type WarehouseHandler struct {
	service service.WarehouseService
}

func NewWarehouseHandler(service service.WarehouseService) *WarehouseHandler {
	return &WarehouseHandler{service: service}
}

func (h *WarehouseHandler) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	var warehouse entity.Warehouse

	if err := json.NewDecoder(r.Body).Decode(&warehouse); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.service.Create(r.Context(), &warehouse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(warehouse)
}

func (h *WarehouseHandler) GetAll(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	warehouses, err := h.service.GetAll(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(warehouses)
}

func (h *WarehouseHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	warehouse, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		http.Error(w, "Warehouse not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(warehouse)
}

func (h *WarehouseHandler) Update(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var warehouse entity.Warehouse

	if err := json.NewDecoder(r.Body).Decode(&warehouse); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	warehouse.IDWarehouse = id

	if err := h.service.Update(r.Context(), &warehouse); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":         warehouse.IDWarehouse,
		"updated_at": warehouse.UpdatedAt,
	})
}

func (h *WarehouseHandler) Delete(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
