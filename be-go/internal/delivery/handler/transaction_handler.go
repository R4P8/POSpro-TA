package handler

import (
	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/service"
	"Be-ManagementProduct/pkg/exporter"
	"Be-ManagementProduct/pkg/logger"
	"Be-ManagementProduct/pkg/middleware"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

type TransactionHandler struct {
	service service.TransactionService
}

func NewTransactionHandler(service service.TransactionService) *TransactionHandler {
	return &TransactionHandler{service: service}
}

func (h *TransactionHandler) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	var trx entity.Transaction

	// Decode body
	if err := json.NewDecoder(r.Body).Decode(&trx); err != nil {
		log.Warn("invalid transaction payload", "error", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Ambil user dari JWT
	claims, ok := ctx.Value(middleware.UserContextKey).(*middleware.JWTClaims)
	if !ok {
		log.Warn("unauthorized transaction create attempt")
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	trx.IDUser = int64(claims.UserID)

	// Validasi warehouse
	if trx.IDWarehouse == 0 {
		log.Warn("missing id_warehouse on transaction create",
			"user_id", trx.IDUser,
		)
		http.Error(w, "id_warehouse is required", http.StatusBadRequest)
		return
	}

	err := h.service.Create(ctx, &trx)
	if err != nil {
		log.Error("failed to create transaction",
			"user_id", trx.IDUser,
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	log.Info("transaction created successfully",
		"user_id", trx.IDUser,
		"warehouse_id", trx.IDWarehouse,
	)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(trx)
}

func (h *TransactionHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		log.Warn("invalid transaction id", "value", idStr)
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	trx, err := h.service.GetByID(ctx, id)
	if err != nil {
		log.Warn("transaction not found", "id", id)
		http.Error(w, "transaction not found", http.StatusNotFound)
		return
	}

	log.Info("transaction fetched", "id", id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trx)
}

func (h *TransactionHandler) GetAll(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	transactions, err := h.service.GetAll(ctx)
	if err != nil {
		log.Error("failed to fetch transactions", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("transactions fetched",
		"count", len(transactions),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(transactions)
}

func (h *TransactionHandler) GetCashierTransactions(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	data, err := h.service.GetCashierTransactions(ctx)
	if err != nil {
		log.Error("failed to fetch cashier transactions", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("cashier transactions fetched",
		"count", len(data),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *TransactionHandler) GetSalesPerDay(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data, err := h.service.GetSalesPerDay(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *TransactionHandler) ExportSalesPerDayCSV(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data, err := h.service.GetSalesPerDay(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := exporter.ExportSalesPerDayCSV(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *TransactionHandler) ExportSalesPerDayExcel(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data, err := h.service.GetSalesPerDay(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := exporter.ExportSalesPerDayExcel(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
