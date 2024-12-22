import { APIEmbedField, EmbedBuilder } from "discord.js";

export const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Some title")
  .setURL("https://discord.js.org/")
  .setAuthor({
    name: "Some name",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  })
  .setDescription("Some description here")
  //   .setThumbnail("https://i.imgur.com/AfFp7pu.png")
  .addFields(
    { name: "Regular field title", value: "Some value here" },
    {
      name: "1234567890123456789012345678901234567890",
      value: "1234567890123456789012345678901234567890",
    },
    {
      name: "\`\`\`" + "1234567890123456789012345678901234567890" + "\`\`\`",
      value: "\`\`\`" + "1234567890123456789012345678901234567890" + "\`\`\`",
    },
    { name: "\u200B", value: "\u200B" },
    { name: "Inline field title", value: "Some\n value\n here", inline: true },
    { name: "Inline field title", value: "Some value here", inline: true },
    { name: "Inline field title", value: "Some value here", inline: true }
  )
  .addFields({
    name: "Inline field title",
    value: "Some value here",
    inline: true,
  })
  .setImage("https://i.imgur.com/AfFp7pu.png")
  .setTimestamp()
  .setFooter({
    text: "Some footer text here",
    iconURL: "https://i.imgur.com/AfFp7pu.png",
  });

export function embedTable1D(columns: string[], data: string[][]) {
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

  if (
    colWidths.reduce((currSum, width) => {
      currSum + width;
    }, 0) > EMBED_FIELD_MAX_WIDTH
  ) {
    throw new Error(`The row length is too long. Column widths : ${colWidths}`);
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

  const [name, ...restRows] = combineColumns;
  const value = restRows.join("\n");

  const field: APIEmbedField = {
    name: "\`" + name + "\`",
    value: "\`\`\`" + value + "\`\`\`",
  };

  const realField: APIEmbedField = {
    name: " ",
    value: "\`\`\`" + value + "\`\`\`",
  };

  //   let rowLen = 0;
  //   const colWdidths = [];
  //   for (let col of columns) {
  //     rowLen += col.length + 1;
  //     colWidths.push(rowLen);
  //   }
  //   if (rowLen > EMBED_FIELD_MAX_WIDTH) {
  //     throw new Error(`Rows won't fit, length is ${rowLen}`);
  //   }

  //   let fields: APIEmbedField[] = [];
  //   let cols = [];
  //const topRow = columns.join(" ");

  //   let rows = [];

  //   for (let i = 0; i < data.length; i++) {
  //     for (let j = 0; j < data[i].length; j++) {
  //       let len = data[i][j].length;
  //       rows.push(data[i][j]);
  //       if (j != data[i].length - 1) {
  //         rows.push(" ".repeat(colWidths[j] - len));
  //       }
  //     }
  //     rows.push("\n");
  //   }

  //   const field: APIEmbedField = {
  //     name: "\`\`\`" + topRow + "\`\`\`",
  //     value: "\`\`\`" + rows.join("") + "\`\`\`",
  //   };

  //   console.log(field);

  //   for (let i = 0; i < numCols; i++) {
  //     let col = [];

  //     for (let d of data) {
  //       col.push(d[i]);
  //     }
  //     let colString = col.join("\n");
  //     let field: APIEmbedField = {
  //       name: columns[i],
  //       value: colString,
  //       inline: false,
  //     };
  //     fields = [...fields, field];
  //   }

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(
      name +
        "1234567890123456789\n0123456\n7\n8\n90123456789\n0123456789\n012345678901\n234567890123\n456789012345678\n90123456789012\n34567890"
    )
    .setAuthor({
      name: "Daily",
    })
    // .setURL("https://discord.js.org/")
    // .setAuthor({
    //   name: "Some name",
    //   iconURL: "https://i.imgur.com/AfFp7pu.png",
    //   url: "https://discord.js.org",
    // })
    .setDescription(
      name +
        "1234567890123456789\n0123456\n7\n8\n90123456789\n0123456789\n012345678901\n234567890123\n456789012345678\n90123456789012\n34567890"
    )
    // .setThumbnail("https://i.imgur.com/AfFp7pu.png")
    .addFields(realField, field)
    // .addFields({
    //   name: "Inline field title",
    //   value: "Some value here",
    //   inline: true,
    // })
    // .setImage("https://i.imgur.com/AfFp7pu.png")
    .setImage("https://i.imgur.com/AfFp7pu.png")
    .setTimestamp();
  // .setFooter({
  //   text: "Some footer text here",
  //   iconURL: "https://i.imgur.com/AfFp7pu.png",
  // });

  return embed;
}

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
    throw new Error(`The row length is too long. Column widths : ${colWidths}`);
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
