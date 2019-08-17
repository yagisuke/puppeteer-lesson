const puppeteer = require('puppeteer');
const fs = require('fs');
const searchWord = process.argv[2] || 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800
  });
  await page.goto('https://www.shuwasystem.co.jp/', {
    waitUntil: 'networkidle0'
  });

  const inputArea = '#hnaviSearchWord'
  const submitButton = '#hnaviSearchSubmit'

  await page.type(inputArea, searchWord);
  page.click(submitButton);

  await page.waitForNavigation({
    waitUntil: "networkidle0"
  });

  const books = await page.evaluate(selector => {
    return Array.from(document.querySelectorAll(selector), item => {
      return {
        title: item.querySelector('.ttl').innerText,
        img: item.querySelector('img').src,
        url: item.querySelector('a').href,
        price: item.querySelector('.price').innerText
      }
    })
  }, '#main .resultWrap > .bookWrap .ro > li');
  fs.writeFile('output/shuwasystem-search-result.json', JSON.stringify(books), err => {
    if (err) {
      throw err
    }
  })
  await browser.close();
})();
