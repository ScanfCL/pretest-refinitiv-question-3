const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

const params = process.argv[2];

const opts = {
  headers: {
    cookie: "hasCookie=true",
  },
};

let htmlString = "";

const getHtml = async () => {
  return await fetch("https://codequiz.azurewebsites.net/", opts)
    .then((res) => res.text())
    .then((response) => callback(response));
};

const callback = (value) => {
  htmlString = value;
};

async function main() {
  await getHtml();
  // create dom element
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const headersTable = document.getElementsByTagName("th");

  // find headers of table
  const headers = [...headersTable].map((th) => th.innerHTML);
  
  // find rows of table
  const rowTable = document.getElementsByTagName("tr");
  let rowData = [];
  [...rowTable].forEach((row, rowIndex) => {
    let record = {};
    if (rowIndex === 0) {
      return;
    }
    // keep all cells in one row
    const cells = [...row.cells];
    cells.forEach((value, cellIndex) => {
      // get data from each cell to array object data
      record = {
        ...record,
        [headers[cellIndex].trim()]: value.innerHTML.trim(),
      };
    });
    rowData.push(record);
  });

  // show result by find data of array object data
  console.log("rowData", rowData.find((d) => d["Fund Name"] === params)["Nav"]);
}

main();
