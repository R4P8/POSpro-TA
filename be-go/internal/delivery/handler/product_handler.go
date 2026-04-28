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

type ProductHandler struct {
	service service.ProductService
}

func NewProductHandler(service service.ProductService) *ProductHandler {
	return &ProductHandler{service: service}
}

func (h *ProductHandler) Create(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	log.Info("create product request started")

	var product entity.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {

		log.Error("invalid request body",
			"error", err,
		)

		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	claims, ok := ctx.Value(middleware.UserContextKey).(*middleware.JWTClaims)
	if !ok {
		log.Warn("unauthorized access attempt")
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	product.UserInsert = claims.UserID

	if err := h.service.Create(ctx, &product); err != nil {

		log.Error("failed create product",
			"error", err,
			"user_id", claims.UserID,
		)

		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("product created successfully",
		"product_id", product.ID_Product,
		"user_id", claims.UserID,
	)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

func (h *ProductHandler) GetByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		log.Warn("invalid product id",
			"id", idStr,
			"error", err,
		)
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	product, err := h.service.GetByID(ctx, id)
	if err != nil {
		log.Warn("product not found",
			"product_id", id,
			"error", err,
		)
		http.Error(w, "product not found", http.StatusNotFound)
		return
	}

	log.Info("product fetched successfully",
		"product_id", id,
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func (h *ProductHandler) GetAll(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	products, err := h.service.GetAll(ctx)
	if err != nil {
		log.Error("failed to fetch products",
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("products fetched successfully",
		"count", len(products),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func (h *ProductHandler) Update(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		log.Warn("invalid product id",
			"id", idStr,
			"error", err,
		)
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	var product entity.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		log.Warn("invalid request body",
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	claims, ok := ctx.Value(middleware.UserContextKey).(*middleware.JWTClaims)
	if !ok {
		log.Warn("unauthorized update attempt",
			"product_id", id,
		)
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	product.ID_Product = id
	product.UserUpdate = claims.UserID

	if err := h.service.Update(ctx, &product); err != nil {
		log.Error("failed to update product",
			"product_id", id,
			"user_id", claims.UserID,
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("product updated successfully",
		"product_id", id,
		"user_id", claims.UserID,
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

func (h *ProductHandler) Delete(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		log.Warn("invalid product id",
			"id", idStr,
			"error", err,
		)
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	if err := h.service.Delete(ctx, id); err != nil {
		log.Error("failed to delete product",
			"product_id", id,
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("product deleted successfully",
		"product_id", id,
	)

	w.WriteHeader(http.StatusNoContent)
}

func (h *ProductHandler) GetBestSeller(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	data, err := h.service.FindBestSeller(ctx)
	if err != nil {
		log.Error("failed to fetch best seller products",
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("best seller products fetched",
		"count", len(data),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *ProductHandler) GetCriticalStock(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	data, err := h.service.FindCriticalStock(ctx)
	if err != nil {
		log.Error("failed to fetch critical stock products",
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("critical stock products fetched",
		"count", len(data),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *ProductHandler) GetSalesPerProduct(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	ctx := r.Context()
	log := logger.WithContext(ctx)

	data, err := h.service.FindSalesPerProduct(ctx)
	if err != nil {
		log.Error("failed to fetch sales per product",
			"error", err,
		)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	log.Info("sales per product fetched",
		"count", len(data),
	)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *ProductHandler) ExportSalesCSV(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	data, err := h.service.FindSalesPerProduct(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := exporter.ExportSalesCSV(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (h *ProductHandler) ExportSalesExcel(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	data, err := h.service.FindSalesPerProduct(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := exporter.ExportSalesExcel(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (h *ProductHandler) GetStockHistory(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data, err := h.service.GetStockHistory(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (h *ProductHandler) ExportStockHistoryCSV(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data, err := h.service.GetStockHistory(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := exporter.ExportStockHistoryCSV(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func (h *ProductHandler) ExportStockHistoryExcel(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	data, err := h.service.GetStockHistory(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := exporter.ExportStockHistoryExcel(w, data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
