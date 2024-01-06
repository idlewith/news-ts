import * as axios from 'axios'
import * as cheerio from 'cheerio'

async function getNewsUrl(): Promise<string> {
  return 'https://mp.weixin.qq.com/s/R-T_rsz1KQJVs8uInNzkdw'
}

async function getTextFromUrl(): Promise<string> {
  const url = await getNewsUrl()
  const response = await axios.default.get(url)
  return response.data
}

function extractNews(html: string): string {
  const $ = cheerio.load(html)
  const textList: string[] = []
  $('#js_content')
    .find('p')
    .each((index, element) => {
      const text = $(element).text().trim()
      const keywordOfNewsPart = '；'
      if (text.includes(keywordOfNewsPart)) {
        textList.push(text)
      }
    })
  return textList.join('\n\n')
}

async function getNews(): Promise<string> {
  const html = await getTextFromUrl()
  return extractNews(html)
}

if (require.main === module) {
  ;(async () => {
    const newsText = await getNews()
    console.log(newsText)
  })()
}
