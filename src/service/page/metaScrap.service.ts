import cheerio, { CheerioAPI } from 'cheerio';
import request from 'request-promise';

export const metaScrapService = async (url: string) => {
  try {
    const options = {
      uri: url,
      transform: (body: string) => {
        return cheerio.load(body);
      },
    };

    const meta = request(options).then(($: CheerioAPI) => {
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

      return metaDetails;
    });

    return meta;
  } catch (err) {
    throw err;
  }
};
