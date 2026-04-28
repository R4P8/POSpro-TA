package metrics

import (
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/metric"
)

var (
	RequestCounter  metric.Int64Counter
	RequestDuration metric.Float64Histogram
)

func InitMetrics() error {
	meter := otel.Meter("service-be-go")

	var err error

	RequestCounter, err = meter.Int64Counter(
		"http_requests_total",
	)
	if err != nil {
		return err
	}

	RequestDuration, err = meter.Float64Histogram(
		"http_request_duration_seconds",
	)
	if err != nil {
		return err
	}

	return nil
}
