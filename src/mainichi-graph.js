const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  })
  const page = await browser.newPage()

  await page.goto('https://mainichi.jp/graphs/20191013/hpj/00m/050/003000g/1')

  const image = await page.$('#main > article > div > figure > div > img')

  const src = await image.getProperty('src')

  const targetUrl = await src.jsonValue()

  const fileName = targetUrl
    .split('/')
    .pop()
    .split('?')
    .shift()

  const localFileFullPath = path.join('output', 'mainichi-graph-' + fileName)

  const viewSource = await page.goto(targetUrl)

  fs.writeFile(localFileFullPath, await viewSource.buffer(), error => {
    if (error) {
      console.log(error)
    }
    return
  })

  await browser.close()
})()
