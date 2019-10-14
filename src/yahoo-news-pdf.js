const puppeteer = require('puppeteer')
const delay = require('delay')
const path = require('path')

;(async () => {
  const browser = await puppeteer.launch({
    args: ['--lang=ja'],
    // page.pdfはheadlessで実行しないといけない（らしい
    // headless: false,
    slowMo: 50
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800
  })

  await page.goto('https://news.yahoo.co.jp/flash')

  await delay(1000)

  await page.screenshot({
    path: path.join('output', 'yahoo-news-1-before.png')
  })

  Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('#main > div.epCategory > div > ul > li:nth-child(1) > a')
  ])

  await delay(1000)

  await page.emulateMedia('screen')
  await page.screenshot({
    path: path.join('output', 'yahoo-news-2-screen.png')
  })

  await page.emulateMedia('print')
  await page.screenshot({
    path: path.join('output', 'yahoo-news-3-print.png')
  })

  await page.pdf({
    path: path.join('output', 'yahoo-news-4-pdf.pdf'),
    format: 'A4'
  })

  await browser.close()
})()
