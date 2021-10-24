import cheerio, { CheerioAPI } from 'cheerio';
import request from 'request-promise';

export const metaDataService = async (url: string) => {
  try {
    const options = {
      uri: url,
      transform: (body: string) => {
        return cheerio.load(body);
      },
    };

    const data = request(options).then(($: CheerioAPI) => {
      return {
        title: $('.dxSWFG').text(),
        score: $('.iTLWoV')
          .text()
          .slice(0, $('.iTLWoV').text().length - 3),
        metaScore: $('.score-meta').text(),
        rating: $('.jedhex').text().slice(4, $('.iTLWoV').text().length),
        movieSynopsis: $('.dcFkRD').text().trim(),
        genre: $('.fzmeux')
          .text()
          .split(/(?=[A-Z])/)
          .map((value) => value.trim()),
        poster: $('.ipc-image').attr('src'),
      };
    });

    return data;
  } catch (err) {
    throw err;
  }
};
