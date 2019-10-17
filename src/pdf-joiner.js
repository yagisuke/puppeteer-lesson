const puppeteer = require('puppeteer')
const path = require('path')

const waitForAllComplete = async (page, count) => {
  let successCount = 0
  do {
    successCount = await page.evaluate(() => {
      return document.querySelectorAll('#filelist .success').length
    })
  } while (successCount !== count)
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

  await page.goto('https://pdfjoiner.com/ja/')

  const id = await page.evaluate(
    () => document.querySelector('input[type="file"]').id
  )
  const inputTypeFile = await page.$(`#${id}`)

  await inputTypeFile.uploadFile(
    path.relative(process.cwd(), path.join(__dirname, 'pdf-joiner-A.png'))
  )
  await inputTypeFile.uploadFile(
    path.relative(process.cwd(), path.join(__dirname, 'pdf-joiner-B.png'))
  )
  await waitForAllComplete(page, 2)

  await page.click('#download-all')
  await page.waitFor(10000)

  await browser.close()
})()
