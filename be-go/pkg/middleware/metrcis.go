package middleware

import (
	"net/http"
	"time"

	"Be-ManagementProduct/pkg/metrics"

	"github.com/julienschmidt/httprouter"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
)

type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}

func Metrics(routeName string, next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

		start := time.Now()

		rw := &responseWriter{
			ResponseWriter: w,
			status:         200,
		}

		next(rw, r, ps)

		duration := time.Since(start).Seconds()

		metrics.RequestCounter.Add(r.Context(), 1,
			metric.WithAttributes(
				attribute.String("method", r.Method),
				attribute.String("route", routeName),
				attribute.Int("status", rw.status),
			),
		)

		metrics.RequestDuration.Record(r.Context(), duration,
			metric.WithAttributes(
				attribute.String("route", routeName),
			),
		)
	}
}
