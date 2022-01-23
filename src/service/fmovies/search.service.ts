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
      const fMoviesSearchData: any = [];

      $('div.flw-item').each((i, el) => {
        const element = cheerio.load(el);

        fMoviesSearchData.push({
          url: `https://fmoviesto.cc${element('a').attr('href')}`,
          type: element('a').attr('href')?.split('/')[1],
          uuid: element('a').attr('href')?.split('/')[2],
          title: element('h2.film-name').text().trim(),
          hd: !!element('div.film-poster > div').length,
          year: element('div.film-detail > div.fd-infor > span:nth-child(1)')
            .text()
            .trim(),
        });
      });

      return fMoviesSearchData;
    });

    return data;
  } catch (err) {
    throw err;
  }
};
