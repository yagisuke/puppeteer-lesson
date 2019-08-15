const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto('https://yahoo.co.jp');
  await page.screenshot({
    path: 'output/yahoo.png'
  });
  await browser.close();
})();
