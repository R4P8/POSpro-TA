package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/service"
	"Be-ManagementProduct/pkg/logger"

	"github.com/julienschmidt/httprouter"
)

type TransactionItemsHandler struct {
	service service.TransactionItemsService
}

func NewTransactionItemsHandler(s service.TransactionItemsService) *TransactionItemsHandler {
	return &TransactionItemsHandler{service: s}
}

func (h *TransactionItemsHandler) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	var item entity.TransactionItems

	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		log.Warn("invalid transaction item payload", "error", err)
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if item.IDTransaction == 0 || item.IDProduct == 0 || item.Quantity <= 0 {
		log.Warn("invalid transaction item data",
			"transaction_id", item.IDTransaction,
			"product_id", item.IDProduct,
			"quantity", item.Quantity,
		)
		http.Error(w, "invalid data", http.StatusBadRequest)
		return
	}

	err := h.service.Create(ctx, &item)
	if err != nil {
		log.Error("failed to create transaction item",
			"transaction_id", item.IDTransaction,
			"product_id", item.IDProduct,
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Info("transaction item created",
		"transaction_id", item.IDTransaction,
		"product_id", item.IDProduct,
		"quantity", item.Quantity,
	)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}

func (h *TransactionItemsHandler) GetAll(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	items, err := h.service.GetAll(ctx)
	if err != nil {
		log.Error("failed to fetch transaction items", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("transaction items fetched",
		"count", len(items),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func (h *TransactionItemsHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		log.Warn("invalid transaction item id", "value", idStr)
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	item, err := h.service.GetByID(ctx, id)
	if err != nil {
		log.Warn("transaction item not found", "id", id)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	log.Info("transaction item fetched", "id", id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func (h *TransactionItemsHandler) GetByTransactionID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	idStr := ps.ByName("transaction_id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		log.Warn("invalid transaction id", "value", idStr)
		http.Error(w, "invalid transaction id", http.StatusBadRequest)
		return
	}

	items, err := h.service.GetByTransactionID(ctx, id)
	if err != nil {
		log.Warn("transaction items not found",
			"transaction_id", id,
		)
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	log.Info("transaction items fetched by transaction",
		"transaction_id", id,
		"count", len(items),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func (h *TransactionItemsHandler) Update(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	idStr := ps.ByName("id")
	id, _ := strconv.ParseInt(idStr, 10, 64)

	var item entity.TransactionItems
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	item.IDTransactionItem = id

	err := h.service.Update(r.Context(), &item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(item)
}
