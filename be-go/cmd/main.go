package main

import (
	"Be-ManagementProduct/internal/delivery/handler"
	config "Be-ManagementProduct/internal/infrastructure"
	"Be-ManagementProduct/internal/repository"
	"Be-ManagementProduct/internal/routes"
	"Be-ManagementProduct/internal/service"
	"Be-ManagementProduct/pkg/logger"
	"Be-ManagementProduct/pkg/metrics"
	"Be-ManagementProduct/pkg/middleware"
	"context"
	"log/slog"
	"net/http"

	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(); err != nil {
		slog.Warn(".env file not found, using system environment")
	}

	ctx := context.Background()
	shutdownLogger, err := logger.InitLogger(ctx, "service-be-go", "otel-collector:4317")
	if err != nil {
		slog.Error("failed to init logger", "error", err)
	} else {
		defer func() {
			if err := shutdownLogger(ctx); err != nil {
				slog.Error("failed to shutdown logger", "error", err)
			}
		}()
	}
	shutdown := middleware.InitTracer(ctx, "service-be-go", "otel-collector:4317")
	defer shutdown(ctx)

	shutdownMetrics, err := metrics.InitMetricsProvider(ctx, "otel-collector:4317", "service-be-go")
	if err != nil {
		slog.Warn("failed to init metrics provider", "error", err)
	} else {
		defer func() {
			if err := shutdownMetrics(ctx); err != nil {
				slog.Error("failed to shutdown metrics", "error", err)
			}
		}()
	}

	if err := metrics.InitMetrics(); err != nil {
		slog.Warn("failed to init metrics", "error", err)
	}

	db, err := config.DatabaseConnection(ctx)
	if err != nil {
		slog.Warn("failed to connect DB", "error", err)
	}
	defer db.Close()

	// Dependency Injection
	userRepo := repository.NewUserRepository(db)
	userService := service.NewUserService(userRepo)
	userHandler := handler.NewUserHandler(userService)

	tenantRepo := repository.NewTenantRepository(db)
	tenantService := service.NewTenantService(tenantRepo)
	TenantHandler := handler.NewTenantHandler(tenantService)

	userAksesRepo := repository.NewUserAksesRepository(db)
	userAksesService := service.NewUserAksesService(userAksesRepo)
	userAksesHandler := handler.NewUserAksesHandler(userAksesService)

	warehouseRepo := repository.NewWarehouseRepository(db)
	warehouseService := service.NewWarehouseService(warehouseRepo)
	warehouseHandler := handler.NewWarehouseHandler(warehouseService)

	productRepo := repository.NewProductRepository(db)
	productService := service.NewProductService(productRepo)
	productHandler := handler.NewProductHandler(productService)

	transactionRepo := repository.NewTransactionRepository(db)
	transactionService := service.NewTransactionService(db, transactionRepo)
	transactionHandler := handler.NewTransactionHandler(transactionService)

	transactionitemsRepo := repository.NewTransactionItemsRepository(db)
	transactionitemsService := service.NewTransactionItemsService(transactionitemsRepo)
	transactionitemsHandler := handler.NewTransactionItemsHandler(transactionitemsService)

	stocklogRepo := repository.NewStocksLogRepository(db)
	stocklogService := service.NewStocksLogService(stocklogRepo)
	stocklogHandler := handler.NewStocksLogHandler(stocklogService)

	// Register Routes
	router := routes.RegisterRoutes(userHandler, TenantHandler, userAksesHandler,
		warehouseHandler, productHandler, transactionHandler,
		transactionitemsHandler, stocklogHandler)

	// Wrap router with CORS middleware
	handler := middleware.CORS(middleware.OTelHTTP(router))

	slog.Info("✅ Server running on http://localhost:8080")
	slog.Info("✅ CORS enabled for http://localhost:3000")

	// Start Server
	if err := http.ListenAndServe(":8080", handler); err != nil {
		slog.Error("server failed", "error", err)
	}
}
