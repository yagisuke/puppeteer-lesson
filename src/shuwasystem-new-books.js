const puppeteer = require('puppeteer')
const fs = require('fs')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800
  })
  await page.goto('https://www.shuwasystem.co.jp/', {
    waitUntil: 'networkidle0'
  })
  const newBooks = await page.evaluate(selector => {
    return Array.from(document.querySelectorAll(selector), item => {
      return {
        title: item.querySelector('img').alt,
        img: item.querySelector('img').src,
        url: item.querySelector('a').href,
        price: item.querySelector('.price').innerText
      }
    })
  }, '#main_column > .listType1 > ul > li')
  fs.writeFile(
    'output/shuwasystem-new-books.json',
    JSON.stringify(newBooks),
    err => {
      if (err) {
        throw err
      }
    }
  )
  await browser.close()
})()
