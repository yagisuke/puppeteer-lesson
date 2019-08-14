const puppeteer = require('puppeteer');

(async () => {
  const TARGET_URL = 'https://yahoo.co.jp';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(TARGET_URL);
  await page.screenshot({
    path: 'output/yahoo.png'
  });
  await browser.close();
})();
