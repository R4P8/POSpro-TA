package routes

import (
	"Be-ManagementProduct/internal/delivery/handler"
	"Be-ManagementProduct/pkg/middleware"

	"github.com/julienschmidt/httprouter"
)

func RegisterRoutes(userHandler *handler.UserHandler, tenantHandler *handler.TenantHandler,
	userAksesHandler *handler.UserAksesHandler, warehouseHandler *handler.WarehouseHandler,
	productHandler *handler.ProductHandler, transactionHandler *handler.TransactionHandler,
	transactionitems *handler.TransactionItemsHandler, stocklog *handler.StocksLogHandler) *httprouter.Router {

	router := httprouter.New()

	// Auth Routes
	router.Handler("POST", "/Api/register", middleware.Wrap(userHandler.Register, "Register"))
	router.Handler("POST", "/Api/login", middleware.Wrap(userHandler.Login, "Login"))

	router.GET("/Api/profile", middleware.JWTMiddleware(userHandler.Profile))
	router.GET("/Api/profile/:id", middleware.JWTMiddleware(userHandler.GetByID))
	router.PUT("/Api/profile/:id", middleware.JWTMiddleware(userHandler.UpdateProfile))
	router.DELETE("/Api/profile/:id", middleware.JWTMiddleware(userHandler.DeleteAccount))

	// PROTECTED
	router.POST("/Api/tenants", middleware.JWTMiddleware(tenantHandler.Create))
	router.GET("/Api/tenants", middleware.JWTMiddleware(tenantHandler.GetAll))
	router.GET("/Api/tenants/:id", middleware.JWTMiddleware(tenantHandler.GetByID))
	router.PUT("/Api/tenants/:id", middleware.JWTMiddleware(tenantHandler.Update))
	router.DELETE("/Api/tenants/:id", middleware.JWTMiddleware(tenantHandler.Delete))

	// PROTECTED
	router.POST("/Api/users", middleware.JWTMiddleware(userAksesHandler.Create))
	router.GET("/Api/users", middleware.JWTMiddleware(userAksesHandler.GetAll))
	router.GET("/Api/users/:id", middleware.JWTMiddleware(userAksesHandler.GetByID))
	router.PUT("/Api/users/:id", middleware.JWTMiddleware(userAksesHandler.Update))

	// PROTECTED
	router.POST("/Api/warehouses", middleware.JWTMiddleware(warehouseHandler.Create))
	router.GET("/Api/warehouses", middleware.JWTMiddleware(warehouseHandler.GetAll))
	router.GET("/Api/warehouses/:id", middleware.JWTMiddleware(warehouseHandler.GetByID))
	router.PUT("/Api/warehouses/:id", middleware.JWTMiddleware(warehouseHandler.Update))
	router.DELETE("/Api/warehouses/:id", middleware.JWTMiddleware(warehouseHandler.Delete))

	router.GET("/Api/product", middleware.JWTMiddleware(middleware.Metrics("/Api/product", productHandler.GetAll)))
	router.POST("/Api/product", middleware.JWTMiddleware(middleware.Metrics("/Api/product", productHandler.Create)))
	router.GET("/Api/products/report/stockhistory", middleware.JWTMiddleware(middleware.Metrics("/Api/products/report/stockhistory", productHandler.GetStockHistory)))
	router.GET("/Api/products/report/best-seller", middleware.JWTMiddleware(middleware.Metrics("/Api/products/report/best-seller", productHandler.GetBestSeller)))
	router.GET("/Api/products/report/critical-stock", middleware.JWTMiddleware(middleware.Metrics("/Api/products/report/critical-stock", productHandler.GetCriticalStock)))
	router.GET("/Api/products/report/sales", middleware.JWTMiddleware(middleware.Metrics("/Api/products/report/sales", productHandler.GetSalesPerProduct)))
	router.GET("/Api/products/report/sales/export/csv", middleware.JWTMiddleware(productHandler.ExportStockHistoryCSV))
	router.GET("/Api/products/report/sales/export/excel", middleware.JWTMiddleware(productHandler.ExportStockHistoryExcel))
	router.GET("/Api/product/:id", middleware.JWTMiddleware(middleware.Metrics("/Api/product/:id", productHandler.GetByID)))
	router.PUT("/Api/product/:id", middleware.JWTMiddleware(middleware.Metrics("/Api/product/:id", productHandler.Update)))
	router.DELETE("/Api/product/:id", middleware.JWTMiddleware(middleware.Metrics("/Api/product/:id", productHandler.Delete)))

	router.POST("/Api/transaction", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction", transactionHandler.Create)))
	router.GET("/Api/transaction", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction", transactionHandler.GetAll)))
	router.GET("/Api/transaction-report/cashier", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction-report/cashier", transactionHandler.GetCashierTransactions)))
	router.GET("/Api/transaction-report/sales", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction-report/sales", transactionHandler.GetSalesPerDay)))
	router.GET("/Api/transaction-report/sales/export/csv", middleware.JWTMiddleware(transactionHandler.ExportSalesPerDayCSV))
	router.GET("/Api/transaction-report/sales/export/excel", middleware.JWTMiddleware(transactionHandler.ExportSalesPerDayExcel))
	router.GET("/Api/transaction/:id", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction/:id", transactionHandler.GetByID)))

	router.POST("/Api/transaction-items", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction-items", transactionitems.Create)))
	router.GET("/Api/transaction-items", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction-items", transactionitems.GetAll)))
	router.GET("/Api/transaction-items/:id", middleware.JWTMiddleware(middleware.Metrics("/Api/transaction-items/:id", transactionitems.GetByID)))
	router.PUT("/Api/transaction-items/:id", middleware.JWTMiddleware(transactionitems.Update))

	router.POST("/Api/stocks-logs", middleware.JWTMiddleware(middleware.Metrics("/Api/stocks-logs", stocklog.Create)))
	router.GET("/Api/stocks-logs", middleware.JWTMiddleware(middleware.Metrics("/Api/stocks-logs", stocklog.GetAll)))
	router.GET("/Api/stocks-logs/:id", middleware.JWTMiddleware(middleware.Metrics("/Api/stocks-logs/:id", stocklog.GetByID)))

	return router
}
