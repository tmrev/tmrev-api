import cheerio, { CheerioAPI } from 'cheerio';
import request from 'request-promise';

export const searchService = async (url: string) => {
  try {
    const options = {
      uri: url,
      transform: (body: string) => {
        return cheerio.load(body);
      },
    };

    const data = request(options).then(($: CheerioAPI) => {
      const imdbSearchData: any = [];

      $('tr').each((i, el) => {
        const element = cheerio.load(el);
        imdbSearchData.push({
          url: element('a').attr('href'),
          type: element('a').attr('href')?.split('/')[1],
          uuid: element('a').attr('href')?.split('/')[2],
          img: element('a > img').attr('src'),
          title: element('td:nth-child(2) > a').text().trim(),
        });
      });

      return imdbSearchData;
    });

    return data;
  } catch (err) {
    throw err;
  }
};
