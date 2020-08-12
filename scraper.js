const puppeteer = require("puppeteer");

(async () => {
  let movieUrl = "https://www.amazon.in/dp/B07HLFBKVN/";

  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  await page.goto(movieUrl, { waitUntil: "networkidle2" });

  let price = await page.evaluate(() => {
    let priceString = document.getElementById("priceblock_ourprice").innerText;
    const finalPrice = parseFloat(
      priceString.replace("\u20b9", "").replace(",", "")
    );

    return finalPrice;
  });

  if (price < 2000) {
    console.log("It is cheap");
  } else {
    console.log("It is expensive");
  }

  await browser.close();
})();
