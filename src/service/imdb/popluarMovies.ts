import cheerio, { CheerioAPI } from 'cheerio';
import request from 'request-promise';
import OrdinalImage from '../../utils/ordinalImage';
import { metaDataService } from './metaData.service';
import { movePosterService } from './moviePoster.service';

type Data = {
  url: string;
  type: string;
  uuid: string;
  img: string;
  title: string;
};

export const popularMovies = async () => {
  try {
    const options = {
      uri: 'https://www.imdb.com/chart/moviemeter/',
      transform: (body: string) => {
        return cheerio.load(body);
      },
    };

    const data = request(options).then(($: CheerioAPI) => {
      const imdbSearchData: any[] = [];

      $('tbody > tr').each((i, el) => {
        const element = cheerio.load(el);
        imdbSearchData.push({
          url: element('a').attr('href'),
          type: element('a').attr('href')?.split('/')[1],
          uuid: element('a').attr('href')?.split('/')[2],
          img: OrdinalImage(element('a > img').attr('src') as string | null),
          title: element('td:nth-child(2) > a').text().trim(),
          year: element('td.titleColumn > span')
            .text()
            .replace('(', '')
            .replace(')', '')
            .trim(),
        });
      });

      return imdbSearchData;
    });

    return data;
  } catch (err) {
    throw err;
  }
};
