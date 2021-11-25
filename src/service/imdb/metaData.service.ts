import cheerio, { CheerioAPI } from 'cheerio';
import request from 'request-promise';

export const metaDataService = async (url: string, uuid: string) => {
  try {
    const options = {
      uri: url,
      transform: (body: string) => {
        return cheerio.load(body);
      },
    };

    const data = request(options).then(($: CheerioAPI) => {
      return {
        uuid,
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
        year: $(
          '#__next > main > div > section.ipc-page-background.ipc-page-background--base.TitlePage__StyledPageBackground-wzlr49-0.dDUGgO > section > div:nth-child(4) > section > section > div.TitleBlock__Container-sc-1nlhx7j-0.hglRHk > div.TitleBlock__TitleContainer-sc-1nlhx7j-1.jxsVNt > div.TitleBlock__TitleMetaDataContainer-sc-1nlhx7j-2.hWHMKr > ul > li:nth-child(1) > span'
        )
          .text()
          .trim(),
      };
    });

    return data;
  } catch (err) {
    throw err;
  }
};
