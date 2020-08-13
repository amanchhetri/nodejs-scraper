const puppeteer = require("puppeteer");

// Transporter is a nodemailer.createTransport() with mail credentials
const { transporter } = require("./nodemailer-auth");

// Slicing node file-name to get the argument
const args = process.argv.slice(2);
const url = args[0];
const minPrice = args[1];

// Function to send mail with mail options
sendEmail = (subject, body) => {
  const email = {
    to: "gattiflab@gmail.com",
    from: "711coc@gmail.com",
    subject: subject,
    text: body,
  };

  return transporter.sendMail(email);
};

// IIFE
(async () => {
  let browser = await puppeteer.launch();
  let page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  let data = await page.evaluate(() => {
    // Price string which we got from the span innerText
    let priceString = document.getElementById("priceblock_ourprice").innerText;

    // Converting string to a float
    const finalPrice = parseFloat(
      priceString.replace("\u20b9", "").replace(",", "")
    );

    // Product Title
    let productTitle = document.getElementById("productTitle").innerText;

    return { finalPrice, productTitle };
  });

  // Price of the product is compared to the desired price
  if (data.finalPrice < minPrice) {
    console.log(
      `The price of ${data.productTitle} has dropped below ${minPrice}`
    );

    sendEmail(
      "Price is low",
      `The price of ${data.productTitle} has dropped below ${minPrice}. Product URL - ${url}`
    );
  } else {
    console.log("It is expensive");
  }

  await browser.close();
})();

// Run Code:

// node file-name url-of-amazon-product your-price
// node scraper https://www.amazon.in/Apple-iPhone-11-128GB-Black/dp/B07XVLW7YK/ 80000
