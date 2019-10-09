const puppeteer = require('puppeteer')

const checkAllScript = `
  const vegetables = document.querySelectorAll('[name="vegetable[]"]')
  vegetables.forEach(vegetable => {
    vegetable.checked = true
    vegetable.parentNode.className = 'cbxbd c_on'
  })
`

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

  await page.goto('http://3min.ntv.co.jp/3min/search_option')

  await page.addScriptTag({ content: checkAllScript })

  await Promise.all([
    page.waitForNavigation({
      waitUntil: 'domcontentloaded'
    }),
    page.click('form[name="searchForm"] .selectBtn a')
  ])

  await page.waitFor(5000)

  await browser.close()
})()
