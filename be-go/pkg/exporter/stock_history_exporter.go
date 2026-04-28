package exporter

import (
	"encoding/csv"
	"net/http"
	"strconv"

	"Be-ManagementProduct/internal/entity"

	"github.com/xuri/excelize/v2"
)

func ExportStockHistoryCSV(w http.ResponseWriter, data []entity.ProductStockHistory) error {
	w.Header().Set("Content-Disposition", "attachment; filename=stock_history.csv")
	w.Header().Set("Content-Type", "text/csv; charset=utf-8")

	//  BOM biar Excel kebaca UTF-8
	w.Write([]byte{0xEF, 0xBB, 0xBF})

	writer := csv.NewWriter(w)
	writer.Comma = ';' //  penting untuk Excel Indonesia
	defer writer.Flush()

	// Header
	if err := writer.Write([]string{
		"Created At",
		"Product Name",
		"Stock",
		"Minimum Stock",
		"Active",
	}); err != nil {
		return err
	}

	// Data
	for _, d := range data {
		if err := writer.Write([]string{
			d.CreatedAt.Format("2006-01-02 15:04:05"),
			d.Name,
			strconv.FormatInt(d.Stock, 10),
			strconv.FormatInt(d.MinimumStock, 10),
			strconv.FormatBool(d.IsActive),
		}); err != nil {
			return err
		}
	}

	return writer.Error()
}

func ExportStockHistoryExcel(w http.ResponseWriter, data []entity.ProductStockHistory) error {
	f := excelize.NewFile()
	defer func() {
		_ = f.Close()
	}()

	sheet := "Stock History"
	f.SetSheetName("Sheet1", sheet)

	headers := []string{
		"Created At",
		"Product Name",
		"Stock",
		"Minimum Stock",
		"Active",
	}

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

	//  Data Style
	textStyle, _ := f.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{Horizontal: "left"},
		Border: []excelize.Border{
			{Type: "left", Style: 1},
			{Type: "right", Style: 1},
			{Type: "top", Style: 1},
			{Type: "bottom", Style: 1},
		},
	})

	centerStyle, _ := f.NewStyle(&excelize.Style{
		Alignment: &excelize.Alignment{Horizontal: "center"},
		Border: []excelize.Border{
			{Type: "left", Style: 1},
			{Type: "right", Style: 1},
			{Type: "top", Style: 1},
			{Type: "bottom", Style: 1},
		},
	})

	// Header
	for col, h := range headers {
		cell, _ := excelize.CoordinatesToCellName(col+1, 1)
		f.SetCellValue(sheet, cell, h)
		f.SetCellStyle(sheet, cell, cell, headerStyle)
	}

	// Data
	for i, d := range data {
		row := i + 2

		a := "A" + strconv.Itoa(row)
		b := "B" + strconv.Itoa(row)
		c := "C" + strconv.Itoa(row)
		dc := "D" + strconv.Itoa(row)
		e := "E" + strconv.Itoa(row)

		f.SetCellValue(sheet, a, d.CreatedAt.Format("2006-01-02 15:04:05"))
		f.SetCellValue(sheet, b, d.Name)
		f.SetCellValue(sheet, c, d.Stock)
		f.SetCellValue(sheet, dc, d.MinimumStock)
		f.SetCellValue(sheet, e, d.IsActive)

		f.SetCellStyle(sheet, a, b, textStyle)
		f.SetCellStyle(sheet, c, e, centerStyle)
	}

	//  Column Width (biar gak berdempetan)
	f.SetColWidth(sheet, "A", "A", 22)
	f.SetColWidth(sheet, "B", "B", 30)
	f.SetColWidth(sheet, "C", "E", 18)

	//  Freeze header
	f.SetPanes(sheet, &excelize.Panes{
		Freeze:      true,
		Split:       false,
		YSplit:      1,
		TopLeftCell: "A2",
		ActivePane:  "bottomLeft",
	})

	// Response
	w.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	w.Header().Set("Content-Disposition", "attachment; filename=stock_history.xlsx")

	return f.Write(w)
}
