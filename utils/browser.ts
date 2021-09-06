import puppeteer from 'puppeteer';

async function startBrowser() {
  try {
    console.log('Opening the browser......');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });

    return browser;
  } catch (err) {
    console.error('Could not create a browser instance => : ', err);
    throw err;
  }
}

export default startBrowser;
