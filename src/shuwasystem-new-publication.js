const puppeteer = require('puppeteer')
const stringify = require('csv-stringify')
const iconv = require('iconv-lite')
const fs = require('fs')
const path = require('path')
const delay = require('delay')

const getInfoFromChildPage = async (browser, url) => {
  const childPage = await browser.newPage()
  await childPage.goto(url)

  const info = await childPage.evaluate(() => {
    const bookTitle = document.querySelector('h1.titleType1').textContent
    const detailInfo = Array.from(
      document.querySelectorAll(
        '#main > .detail > .right > table tbody > tr > td'
      )
    ).map(td => td.textContent)
    return [].concat(bookTitle, detailInfo)
  })

  await childPage.close()
  return info
}

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

  await page.goto('https://www.shuwasystem.co.jp/search/next.html')

  // 新刊の詳細ページへのリンク一覧を取得
  const links = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('#main .bookWrap > ul > li > .image > a')
    ).map(a => a.href)
  )

  // 詳細ページから新刊の情報を取得
  const csvData = []
  for (const link of links) {
    await delay(1000) // やさしさ
    const info = await getInfoFromChildPage(browser, link)
    csvData.push(info)
  }

  // csv出力処理
  stringify(csvData, (err, csvString) => {
    const date = new Date()
    const csvFile = `shuwasystem-new-publication-on-${date.getFullYear()}-${date.getMonth() +
      1}-${date.getDate()}.csv`
    const writableStream = fs.createWriteStream(path.join('output', csvFile))
    writableStream.write(iconv.encode(csvString, 'UTF-8'))
  })

  await browser.close()
})()
