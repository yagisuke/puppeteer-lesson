const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  })
  const page = await browser.newPage()

  await page.goto('http://www.jma.go.jp/jp/yoho/')
  // 関東で絞り込む
  await page.select('select[name=elarealist]', '206')
  // 神奈川で絞り込む
  await page.select('select[name=elfukenlist]', '320')

  await page.screenshot({
    path: 'output/check-weather-in-kanagawa.png',
    fullPage: true
  })

  await browser.close()
})()
