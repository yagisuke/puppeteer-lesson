const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  })

  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800
  })

  await page.goto('https://www.google.com/')

  const image = await page.$('#lga img')
  const src = await image.getProperty('src')
  const targetUrl = await src.jsonValue()

  const viewSource = await page.goto(targetUrl)
  const fileName = 'google-daily-image-' + targetUrl.split('/').pop()
  const localFileFullPath = path.join('output', fileName)
  fs.writeFile(localFileFullPath, await viewSource.buffer(), error => {
    if (error) {
      console.error(error)
      return
    }
  })
  await browser.close()
})()
