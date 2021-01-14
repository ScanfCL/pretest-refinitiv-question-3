const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

const params = process.argv[2];

const opts = {
  headers: {
    cookie: "hasCookie=true",
  },
};

let htmlString = "";

const renderHtml = async () => {
  return await fetch("https://codequiz.azurewebsites.net/", opts)
    .then((res) => res.text())
    .then((response) => callback(response));
};

const callback = (value) => {
  htmlString = value;
};

async function main() {
  await renderHtml();
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const headersTable = document.getElementsByTagName("th");

  const headers = [...headersTable].map((th) => th.innerHTML);
  const rowTable = document.getElementsByTagName("tr");
  let rowData = [];
  [...rowTable].forEach((row, rowIndex) => {
    let record = {};
    if (rowIndex === 0) {
      return;
    }
    const cells = [...row.cells];
    cells.forEach((value, cellIndex) => {
      record = {
        ...record,
        [headers[cellIndex].trim()]: value.innerHTML.trim(),
      };
    });
    rowData.push(record);
  });

  console.log("rowData", rowData.find((d) => d["Fund Name"] === params)["Nav"]);
}

main();
