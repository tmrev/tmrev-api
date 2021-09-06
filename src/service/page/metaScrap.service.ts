import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import startBrowser from '../../../utils/browser';

export const metaScrapService = async (url: string) => {
  try {
    const scraperObject = {
      url,
      async scraper(browser: puppeteer.Browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        const content = await page.content();

        const $ = cheerio.load(content);

        const metaDetails = {
          type: $('meta[property="og:type"]').attr('content') || null,
          title: $('meta[property="og:title"]').attr('content') || null,
          url: $('meta[property="og:url"]').attr('content') || null,
          siteName: $('meta[property="og:site_name"]').attr('content') || null,
          description:
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            null,
          image: $('meta[property="og:image"]').attr('content') || null,
        };

        page.close().then(() => console.log('Closing the browser...'));
        return metaDetails;
      },
    };

    const browserInstance = await startBrowser();

    const meta = scraperObject.scraper(browserInstance);

    return meta;
  } catch (err) {
    throw err;
  }
};
