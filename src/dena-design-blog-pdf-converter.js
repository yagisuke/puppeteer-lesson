const puppeteer = require('puppeteer')
const converter = require('convert-filename-ja')
const path = require('path')

const pdfStyle = `
  * {
    -webkit-print-color-adjust: exact;
  }
  body {
    margin: 0;
    padding: 0;
  }
  .iframe,
  .module-header,
  .module-header-spacer,
  .module-aside,
  .module-aside-nav,
  .module-entry-share,
  .module-footer,
  .module-pagetop {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    opacity: 0 !important;
  }
`

;(async () => {
  // setup
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  })
  const page = await browser.newPage()
  await page.setViewport({
    width: 1200,
    height: 800
  })
  await page.goto('https://design.dena.com/')

  // article list
  const articles = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('.module-entry-list .module-entry-list-item'),
      item => {
        return {
          title: item.querySelector('[name="entry-title"]').innerText,
          updatedAt: item
            .querySelector('.posted-date')
            .innerText.replace(/\./g, '-'),
          url: item.querySelector('.link-to').href
        }
      }
    )
  })

  for (let i = 0; i < articles.length; i++) {
    const { title, updatedAt, url } = articles[i]
    const prefix = converter.convert(`${updatedAt}-${title}`)

    console.log(`start: ${prefix}`)

    await page.waitFor(1000)

    await page.goto(url, {
      waitUntil: 'networkidle0'
    })

    await page.addStyleTag({
      content: pdfStyle
    })

    await page.pdf({
      path: path.join('output/DeNA_DESIGN_BLOG/pdf', `${prefix}.pdf`),
      format: 'A4',
      margin: {
        top: 32,
        right: 32,
        bottom: 32,
        left: 32
      }
    })

    console.log(`end: ${prefix}`)
  }

  await browser.close()
})()
