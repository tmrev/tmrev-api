import cheerio, { CheerioAPI } from 'cheerio';
import request from 'request-promise';

export const searchService = async (url: string, path: string) => {
  try {
    const options = {
      uri: url,
      transform: (body: string) => {
        return cheerio.load(body);
      },
    };

    const data = request(options).then(($: CheerioAPI) => {
      const numberMoviesSearchData: any = [];

      $('a.poster').each((i, el) => {
        const element = cheerio.load(el);

        numberMoviesSearchData.push({
          url: element('a').attr('href'),
          uuid: element('a').attr('href')?.split('/')[4],
          title: element('.item-title').text().trim(),
          hd:
            element('span.mlbq').length &&
            element('span.mlbq').text().trim() === 'HD',
        });
      });

      return numberMoviesSearchData;
    });

    return data;
  } catch (err) {
    throw err;
  }
};
