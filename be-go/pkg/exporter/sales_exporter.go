package exporter

import (
	"encoding/csv"
	"io"
	"strconv"

	"github.com/xuri/excelize/v2"

	"Be-ManagementProduct/internal/entity"
)

func ExportSalesCSV(w io.Writer, data []entity.BestSellerProduct) error {
	writer := csv.NewWriter(w)
	defer writer.Flush()

	// Header
	if err := writer.Write([]string{"Product Name", "Quantity", "Price"}); err != nil {
		return err
	}

	// Data
	for _, d := range data {
		if err := writer.Write([]string{
			d.Name,
			strconv.FormatInt(d.Quantity, 10),
			strconv.FormatFloat(d.Price, 'f', 2, 64),
		}); err != nil {
			return err
		}
	}

	return writer.Error()
}

func ExportSalesExcel(w io.Writer, data []entity.BestSellerProduct) error {
	f := excelize.NewFile()
	defer func() {
		_ = f.Close()
	}()

	sheet := "Sales Report"
	f.SetSheetName("Sheet1", sheet)

	// Header
	headers := []string{"Product Name", "Quantity", "Price"}
	for col, value := range headers {
		cell, _ := excelize.CoordinatesToCellName(col+1, 1)
		f.SetCellValue(sheet, cell, value)
	}

	// Data
	for i, d := range data {
		row := i + 2
		f.SetCellValue(sheet, "A"+strconv.Itoa(row), d.Name)
		f.SetCellValue(sheet, "B"+strconv.Itoa(row), d.Quantity)
		f.SetCellValue(sheet, "C"+strconv.Itoa(row), d.Price)
	}

	return f.Write(w)
}
