const puppeteer = require('puppeteer')
const fs = require('fs')

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100
  })

  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 800
  })

  await page.goto('https://beauty.hotpepper.jp/svcSA/macAD/stylist/', {
    waitUntil: 'networkidle0'
  })

  await Promise.all([
    page.click('#netReserse2'), // 指名OK
    page.click('#imageIC19'), // メンズカット
    page.click('#sex1') // 女性
  ])
  await Promise.all([
    page.waitForNavigation({
      waitUntil: 'domcontentloaded'
    }),
    page.click('#stylistSearchForm input[type="submit"]')
  ])
  console.log(
    '[指名OK][メンズカットが得意][女性スタイリスト]で絞り込みました------------------------------'
  )

  const pageSize = await page.$eval('#mainContents .pageControl', item => {
    return Number(item.innerHTML.match(/\d+ページ/)[0].replace('ページ', ''))
  })
  console.log(
    `これから${pageSize}ページのスタイリスト情報を取得していきます------------------------------`
  )

  let result = []

  for (let i = 1; i <= pageSize; i++) {
    console.log(
      `${i}ページ目のスタイリスト情報を取得中です------------------------------`
    )
    const stylists = await page.evaluate(selector => {
      return Array.from(document.querySelectorAll(selector), item => {
        return {
          name: item.querySelector('.slcHeadContentsInner h3').innerText,
          url: item
            .querySelector('.slcHeadContentsInner a')
            .href.replace(/\?.*$/, ''),
          img: item.querySelector('.slcBody a img').src
        }
      })
    }, '#mainContents > ul > li')
    Array.prototype.push.apply(result, stylists)

    if (i === pageSize) break

    await page.waitFor(1000)
    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'domcontentloaded'
      }),
      page.click('#mainContents .pageControl .arrowPagingR')
    ])
  }

  const path = 'output/hpb-stylist-search.json'
  console.log(
    `合計${result.length}人のスタイリスト情報を取得しました------------------------------`
  )
  fs.writeFile(path, JSON.stringify(result), err => {
    if (err) {
      throw err
    }
  })

  console.log(
    `こちらの情報は${path}に保存しました------------------------------`
  )
  await browser.close()
})()
