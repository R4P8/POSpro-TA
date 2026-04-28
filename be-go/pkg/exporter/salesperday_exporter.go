package exporter

import (
	"encoding/csv"
	"net/http"
	"strconv"

	"github.com/xuri/excelize/v2"

	"Be-ManagementProduct/internal/entity"
)

func ExportSalesPerDayCSV(w http.ResponseWriter, data []entity.SalesPerDay) error {

	w.Header().Set("Content-Disposition", "attachment; filename=sales_per_day.csv")
	w.Header().Set("Content-Type", "text/csv; charset=utf-8")

	//  BOM
	w.Write([]byte{0xEF, 0xBB, 0xBF})

	writer := csv.NewWriter(w)
	writer.Comma = ';' //  penting
	defer writer.Flush()

	// Header
	if err := writer.Write([]string{"Date", "Quantity", "Price", "Total"}); err != nil {
		return err
	}

	// Data
	for _, d := range data {
		err := writer.Write([]string{
			d.CreatedAt.Format("2006-01-02 15:04:05"),
			strconv.FormatInt(d.Quantity, 10),
			strconv.FormatFloat(d.Price, 'f', 2, 64),
			strconv.FormatFloat(d.Total, 'f', 2, 64),
		})
		if err != nil {
			return err
		}
	}

	return writer.Error()
}

func ExportSalesPerDayExcel(w http.ResponseWriter, data []entity.SalesPerDay) error {

	f := excelize.NewFile()
	defer func() {
		_ = f.Close()
	}()

	sheet := "Sales Per Day"
	f.SetSheetName("Sheet1", sheet)

	headers := []string{"Date", "Quantity", "Price", "Total"}

	//  Header Style
	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font: &excelize.Font{Bold: true},
		Alignment: &excelize.Alignment{
			Horizontal: "center",
			Vertical:   "center",
		},
		Border: []excelize.Border{
			{Type: "left", Style: 1},
			{Type: "right", Style: 1},
			{Type: "top", Style: 1},
			{Type: "bottom", Style: 1},
		},
	})

	//  Text Style
	textStyle, _ := f.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{Horizontal: "left"},
		Border: []excelize.Border{
			{Type: "left", Style: 1},
			{Type: "right", Style: 1},
			{Type: "top", Style: 1},
			{Type: "bottom", Style: 1},
		},
	})

	//  Number Style (2 decimal)
	numberStyle, _ := f.NewStyle(&excelize.Style{
		NumFmt: 2, // 0.00
		Alignment: &excelize.Alignment{
			Horizontal: "center",
		},
		Border: []excelize.Border{
			{Type: "left", Style: 1},
			{Type: "right", Style: 1},
			{Type: "top", Style: 1},
			{Type: "bottom", Style: 1},
		},
	})

	// Header
	for col, value := range headers {
		cell, _ := excelize.CoordinatesToCellName(col+1, 1)
		f.SetCellValue(sheet, cell, value)
		f.SetCellStyle(sheet, cell, cell, headerStyle)
	}

	// Data
	for i, d := range data {
		row := i + 2

		a := "A" + strconv.Itoa(row)
		b := "B" + strconv.Itoa(row)
		c := "C" + strconv.Itoa(row)
		dc := "D" + strconv.Itoa(row)

		f.SetCellValue(sheet, a, d.CreatedAt.Format("2006-01-02 15:04:05"))
		f.SetCellValue(sheet, b, d.Quantity)
		f.SetCellValue(sheet, c, d.Price)
		f.SetCellValue(sheet, dc, d.Total)

		f.SetCellStyle(sheet, a, a, textStyle)
		f.SetCellStyle(sheet, b, dc, numberStyle)
	}

	//  Column Width
	f.SetColWidth(sheet, "A", "A", 22)
	f.SetColWidth(sheet, "B", "B", 15)
	f.SetColWidth(sheet, "C", "D", 18)

	//  Freeze header (FIX versi terbaru)
	f.SetPanes(sheet, &excelize.Panes{
		Freeze:      true,
		Split:       false,
		YSplit:      1,
		TopLeftCell: "A2",
		ActivePane:  "bottomLeft",
	})

	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	w.Header().Set("Content-Disposition", "attachment; filename=sales_per_day.xlsx")

	return f.Write(w)
}
