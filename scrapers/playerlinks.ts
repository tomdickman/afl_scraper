import puppeteer from 'puppeteer';

export const getPlayerLinks = async (year: number): Promise<string[]> => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage();
  await page.goto(`https://afltables.com/afl/stats/${year}.html`, {
    waitUntil: 'networkidle2',
  });
  const urls = await page.$$eval("table tbody tr td a", links => {
    // @ts-ignore
    return links.map(el => el?.href)
  })
  await browser.close()

  return urls
}
