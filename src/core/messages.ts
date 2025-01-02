export function exampleStockTable() {
  const table = table1D(
    ["Ticker    ", "Price", "24H", "1WK", "1MO"],
    [
      ["Plac", "Plac", "Placeholder", "Pla", "Pla"],
      ["Plac", "Plac", "Pla", "Pla", "Placeholder"],
    ]
  );
  return table;
}

export function snapshotTable(snapshot: any) {
  const arr = [];
  for (let key in snapshot) {
    arr.push(snapshot[key]);
  }

  const table = table1D(["Ticker", "Price", "24H", "1WK", "1MO"], [arr]);
  return table;
}

export function table1D(columns: string[], data: string[][]) {
  //validate maybe do something else here later?
  const numCols = columns.length;
  const EMBED_FIELD_MAX_WIDTH = 40;

  for (let d of data) {
    if (d.length != numCols) {
      throw new Error("Data is not equal to columns");
    }
  }

  const tableData: string[][] = [columns, ...data];
  const colWidths = new Array(numCols).fill(0);

  for (let i = 0; i < tableData.length; i++) {
    for (let j = 0; j < tableData[i].length; j++) {
      let width = tableData[i][j].length + 1;
      colWidths[j] = Math.max(colWidths[j], width);
    }
  }

  const totalWidth = colWidths.reduce((currSum, width) => {
    return currSum + width;
  }, 0);

  //   console.log(`Total width: ${totalWidth} ${colWidths}`);

  if (totalWidth > EMBED_FIELD_MAX_WIDTH) {
    throw new Error(
      `The row length is too long. Column widths : ${colWidths} \n Data: ${data}`
    );
  }

  for (let i = 0; i < tableData.length; i++) {
    for (let j = 0; j < tableData[i].length; j++) {
      if (j < tableData[i].length - 1) {
        tableData[i][j] += " ".repeat(colWidths[j] - tableData[i][j].length);
      }
    }
  }

  const combineColumns: string[] = [];
  for (let col of tableData) {
    combineColumns.push(col.join(""));
  }

  const [header, ...restRows] = combineColumns;
  const dataRows = restRows.join("\n");
  return "\`\`\`" + header + "\n" + dataRows + "\`\`\`";
}
