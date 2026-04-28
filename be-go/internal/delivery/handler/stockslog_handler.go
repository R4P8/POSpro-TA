package handler

import (
	"Be-ManagementProduct/internal/entity"
	"Be-ManagementProduct/internal/service"
	"Be-ManagementProduct/pkg/logger"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/julienschmidt/httprouter"
)

type StocksLogHandler struct {
	service service.StocksLogService
}

func NewStocksLogHandler(service service.StocksLogService) *StocksLogHandler {
	return &StocksLogHandler{service: service}
}

func (h *StocksLogHandler) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	var stockLog entity.StocksLog

	if err := json.NewDecoder(r.Body).Decode(&stockLog); err != nil {
		log.Warn("invalid stock log payload", "error", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// 🔥 Normalisasi & mapping type sesuai DB constraint
	switch strings.ToLower(stockLog.Type) {
	case "out":
		stockLog.Type = "sale"
	case "in":
		stockLog.Type = "restock"
	case "adjust":
		stockLog.Type = "adjustment"
	case "sale", "restock", "adjustment":
		// valid
	default:
		log.Warn("invalid stock log type",
			"type", stockLog.Type,
		)
		http.Error(w, "invalid stock log type (allowed: sale, restock, adjustment)", http.StatusBadRequest)
		return
	}

	// Validasi field penting
	if stockLog.IDWarehouse == 0 || stockLog.ID_Product == 0 || stockLog.ID_User == 0 {
		log.Warn("missing required stock log fields",
			"warehouse_id", stockLog.IDWarehouse,
			"product_id", stockLog.ID_Product,
			"user_id", stockLog.ID_User,
		)
		http.Error(w, "missing required fields", http.StatusBadRequest)
		return
	}

	if stockLog.Quantity_Change <= 0 {
		log.Warn("invalid quantity_change",
			"quantity_change", stockLog.Quantity_Change,
		)
		http.Error(w, "quantity_change must be greater than 0", http.StatusBadRequest)
		return
	}

	err := h.service.Create(ctx, &stockLog)
	if err != nil {
		log.Error("failed to create stock log",
			"type", stockLog.Type,
			"product_id", stockLog.ID_Product,
			"warehouse_id", stockLog.IDWarehouse,
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("stock log created",
		"type", stockLog.Type,
		"product_id", stockLog.ID_Product,
		"warehouse_id", stockLog.IDWarehouse,
		"quantity_change", stockLog.Quantity_Change,
	)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(stockLog)
}

func (h *StocksLogHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		log.Warn("invalid stock log id", "value", idStr)
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	stockLog, err := h.service.GetByID(ctx, id)
	if err != nil {
		log.Warn("stock log not found", "id", id)
		http.Error(w, "stock log not found", http.StatusNotFound)
		return
	}

	log.Info("stock log fetched", "id", id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stockLog)
}

func (h *StocksLogHandler) GetAll(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	logs, err := h.service.GetAll(ctx)
	if err != nil {
		log.Error("failed to fetch stock logs", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("stock logs fetched",
		"count", len(logs),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}

func (h *StocksLogHandler) GetByProductID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	productIDStr := ps.ByName("product_id")
	productID, err := strconv.ParseInt(productIDStr, 10, 64)
	if err != nil {
		log.Warn("invalid product id", "value", productIDStr)
		http.Error(w, "invalid product id", http.StatusBadRequest)
		return
	}

	logs, err := h.service.GetByProductID(ctx, productID)
	if err != nil {
		log.Error("failed to fetch stock logs by product",
			"product_id", productID,
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("stock logs fetched by product",
		"product_id", productID,
		"count", len(logs),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}
