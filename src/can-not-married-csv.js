const stringify = require('csv-stringify')
const fs = require('fs')
const iconv = require('iconv-lite')
const path = require('path')

;(() => {
  const castData = [
    ['桑野信介', '阿部寛', '06月22日'],
    ['吉山まどか', '吉田羊', '02月03日'],
    ['戸波早紀', '深川麻衣', '03月29日'],
    ['村上英治', '塚本高史', '10月27日'],
    ['森山桜子', '咲妃みゆ', '03月16日'],
    ['中川ゆみ', '平祐奈', '11月12日'],
    ['沢村映子', '阿南敦子', '12月16日'],
    ['横田詩織役', '奈緒', '02月10日']
  ]

  stringify(castData, (error, csvString) => {
    const writableStream = fs.createWriteStream(
      path.join('output', 'can-not-married.csv')
    )
    writableStream.write(iconv.encode(csvString, 'UTF-8'))
  })
})()
