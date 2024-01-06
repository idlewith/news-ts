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
  const divContent = $('#js_content')

  const textList: string[] = []
  divContent.find('p').each((index, element) => {
    const textP = $(element).text().trim()

    const keywordNewsPart = '；'
    const isNewsTextExist = textP.includes(keywordNewsPart)
    if (!isNewsTextExist) {
      return
    }

    textList.push(textP)
  })

  return textList.join('\n\n')
}

async function getNews(): Promise<void> {
  const html = await getTextFromUrl()
  const newsText = extractNews(html)
  console.log(newsText)
}

if (require.main === module) {
  getNews()
}
