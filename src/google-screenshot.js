const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 })
  await page.goto('https://www.google.com/')
  await page.screenshot({
    path: 'output/google-screenshot.png'
  })
  await browser.close()
})()
