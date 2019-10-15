const puppeteer = require('puppeteer')
// 環境変数に値をセット
require('dotenv').config()
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

  await page.goto('https://twitter.com/login')
  await page.type('input.js-username-field', process.env.TWITTER_USER_ID)
  await page.type('input.js-password-field', process.env.TWITTER_USER_PASSWORD)
  await page.click('form.js-signin button.submit')

  await page.waitFor(5000)

  await browser.close()
})()
