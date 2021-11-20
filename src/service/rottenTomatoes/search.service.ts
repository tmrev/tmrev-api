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
      const rottenSearchData: any = [];

      $('search-page-media-row').each((i, el) => {
        const element = cheerio.load(el);

        rottenSearchData.push({
          url: element('a:nth-child(1)').attr('href'),
          img: element('a:nth-child(1) > img').attr('src'),
          type: element('a:nth-child(1)').attr('href')?.split('/')[3],
          uuid: element('a:nth-child(1)').attr('href')?.split('/')[4],
          title: element('a:nth-child(2)').text().trim(),
          year: $(el).attr('releaseyear'),
        });
      });

      return rottenSearchData;
    });

    return data;
  } catch (err) {
    throw err;
  }
};
