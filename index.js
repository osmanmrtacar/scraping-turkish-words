const fs = require("fs");
const cheerio = require("cheerio");
const rp = require("request-promise");

const myData = []

async function makeRequest(i) {
  await rp(
    {
      method: "GET",
      url: "https://www.turkishclass101.com/turkish-word-lists/?page=" + i,
    },
    (err, res, body) => {
      if (err) {
        console.error(err);
        return;
      }

      let $ = cheerio.load(body);
      $(".wlv-item__box").each(function (i, elem) {
        const turkishWord = $(this).find(".js-wlv-word").text()
        const englishWord = $(this).find(".js-wlv-english").text()
        const turkishSentence = $(this).find($("div.wlv-item__word-line > span")).eq(-1).text()
        const englishSentence = $(this).find(".wlv-item__english-container span").eq(-1).text()
        const image = $(this).find("img").attr('src')
        const data = { turkishWord, englishWord, turkishSentence, englishSentence, image };

        myData.push(data)
      });
    }
  );
}

async function start() {
  for (let index = 1; index <= 5; index++) {
    await makeRequest(index);
  }
   fs.writeFile("./data.json", JSON.stringify(myData, null, 2), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  }); 
}

 start();
