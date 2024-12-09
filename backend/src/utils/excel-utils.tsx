import Excel from 'exceljs';

interface ColumnDefinition {
  label: string;
  value: string;
  name: string;
  isNumeric?: boolean;
  isPercentage?: boolean;
}

interface ExcelWithTabsArgs {
  tables: { extraInfoTable: TableDefinition; detailsTable: TableDefinition }[];
  worksheetLabel?: string;
  isLastRowBold?: boolean;
}

export type TableDefinition = {
  columnDefinition: ColumnDefinition[];
  rows: any[];
  withHeadersName?: boolean;
};

const SPEC_BETWEEN_TABLES = 1;

export async function createExcelWithTabs(params: ExcelWithTabsArgs[]) {
  try {
    const workbook = new Excel.Workbook();
    params.forEach((tab) => {
      preperExcelTab(workbook, tab);
    });
    // const buffer = await workbook.xlsx.createInputStream()
    // return (buffer as Buffer).toString('base64')
  } catch (error) {
    throw new Error(`error creating excel: ${error}`);
  }
}

export async function createExcel(
  tables: { detailsTable: TableDefinition; extraInfoTable: TableDefinition }[],
  worksheetLabel?: string,
  isLastRowBold?: boolean,
) {
  try {
    const workbook = new Excel.Workbook();
    preperExcelTab(workbook, {
      tables,
      worksheetLabel,
      isLastRowBold,
    });
    const buffer = await workbook?.xlsx?.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    return (buffer as Buffer).toString('base64');
  } catch (error) {
    throw new Error(`error creating excel: ${error}`);
  }
}

function preperExcelTab(
  workbook: any,
  { tables, worksheetLabel }: ExcelWithTabsArgs,
) {
  const worksheet = workbook.addWorksheet(worksheetLabel || 'Sheet 1');
  let rowsCount = 0;

  for (const table of tables) {
    if (table.extraInfoTable) {
      worksheet.addTable({
        name: 'extraDataTable',
        ref: `A${rowsCount + 1}`,
        headerRow: table.extraInfoTable?.withHeadersName ?? false,
        columns: table.extraInfoTable.columnDefinition?.map((field) => ({
          header: field?.label,
          key: field?.name,
          name: field?.label,
        })),
        rows: table.extraInfoTable.rows,
      });
      rowsCount += table.extraInfoTable?.rows?.length || 0;
    }
    worksheet.addTable({
      name: 'MainTable',
      ref: `A${rowsCount + 1}`,
      columns: table.detailsTable.columnDefinition.map((col) => ({
        header: col.label,
        key: col.name,
        name: col.label,
      })),
      rows: table.detailsTable.rows.map((row) =>
        table.detailsTable.columnDefinition.map((col) => row[col.value]),
      ),
      style: { numFmt: '' },
    });
    rowsCount += (table.detailsTable?.rows?.length || 0) + SPEC_BETWEEN_TABLES;
  }
  worksheet.properties.defaultColWidth = 20;

  // if (isLastRowBold && worksheet.lastRow) {
  //   worksheet.lastRow.font = { bold: true };
  // }
}
