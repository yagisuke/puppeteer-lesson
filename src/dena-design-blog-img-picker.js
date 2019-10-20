const puppeteer = require('puppeteer')
const converter = require('convert-filename-ja')
const path = require('path')
const fs = require('fs')
const request = require('request')
const { promisify } = require('util')

const downloadFile = async (url, fileName) => {
  console.log(`download: ${fileName}`)
  const res = await promisify(request)({
    method: 'GET',
    uri: url,
    encoding: null
  })

  if (res.statusCode === 200) {
    await promisify(fs.writeFile)(
      path.join('output/DeNA_DESIGN_BLOG/img', fileName),
      res.body,
      'binary'
    )
  } else {
    throw new Error(`${res.statusCode} ダウンロードエラー`)
  }
}

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
    await page.waitFor(1000)

    const { title, updatedAt, url } = articles[i]
    const prefix = converter.convert(`${updatedAt}-${title}`)

    console.log(`start: ${prefix}`)
    await page.goto(url)

    // get article images
    const imageUrls = await page.evaluate(() => {
      const bgStyle = window.getComputedStyle(
        document.querySelector('p.eyecatch')
      ).background
      const eyecatches = bgStyle.match(
        /(https?:\/\/[\x21-\x7e]+[jpg|jpeg|gif|png])/g
      )

      const images = Array.from(document.querySelectorAll('p.img > img')).map(
        img => img.src
      )
      return eyecatches.concat(images)
    })

    // download images
    for (imageUrl of imageUrls) {
      const fileName = `${prefix}-${imageUrl.split('/').pop()}`
      await downloadFile(imageUrl, fileName)
    }

    console.log(`end: ${prefix}`)
  }

  await browser.close()
})()
