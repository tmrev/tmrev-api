import cheerio, { CheerioAPI } from "cheerio";
import request from "request-promise";

const metaDataService = async (url: string, uuid: string) => {
  try {
    const options = {
      uri: url,
      transform: (body: string) => cheerio.load(body),
    };

    const data = request(options).then(($: CheerioAPI) => {
      const cast: any[] = [];
      const movieInfo: any = {};
      const whereToWatch: any = [];
      const photos: any = [];

      $("a.PhotosCarousel__item-link").each((i, el) => {
        const element = cheerio.load(el);

        photos.push(element("img").attr("data-src"));
      });

      $("#where-to-watch > div > ul > li").each((i, el) => {
        const element = cheerio.load(el);

        whereToWatch.push({
          provider: element("affiliate-icon").attr("name"),
          availability: element(".no-price").text().trim(),
        });
      });

      $(".cast-item").each((i, el) => {
        const element = cheerio.load(el);

        cast.push({
          name: element("a > span").text().trim(),
          character: element(".characters").text().trim(),
          img: element("div.pull-left > a > img").attr("data-src"),
        });
      });

      $(
        "#mainColumn > section.panel.panel-rt.panel-box.movie_info.media > div > div > ul > li"
      ).each((i, el) => {
        const element = cheerio.load(el);

        movieInfo[
          element("div.meta-label")
            .text()
            .trim()
            .split(":")[0]
            .toLowerCase()
            .replace(" ", "-")
        ] = element("div.meta-value").text().trim();
      });

      if (movieInfo.genre) {
        movieInfo.genre = movieInfo.genre
          .split(",")
          .map((value: string) => value.trim().replace("\n", ""));
      }

      if (movieInfo.producer) {
        movieInfo.producer = movieInfo.producer
          .split(",")
          .map((value: string) => value.trim().replace("\n", ""));
      }

      if (movieInfo["release-date (theaters)"]) {
        // eslint-disable-next-line prefer-destructuring
        movieInfo["release-date (theaters)"] =
          movieInfo["release-date (theaters)"].split("\n")[0];
      }

      if (movieInfo.writer) {
        movieInfo.writer = movieInfo.writer
          .split(",")
          .map((value: string) => value.trim().replace("\n", ""));
      }

      return {
        uuid,
        audiencescore: $("score-board").attr("audiencescore"),
        rating: $("score-board").attr("rating"),
        audiencestate: $("score-board").attr("audiencestate"),
        tomatometerstate: $("score-board").attr("tomatometerstate"),
        tomatometerscore: $("score-board").attr("tomatometerscore"),
        title: $("score-board > h1").text().trim(),
        info: {
          year: $("score-board > p").text().trim().split(",")[0].trim(),
          duration: $("score-board > p").text().trim().split(",")[2].trim(),
        },
        movieSynopsis: $("#movieSynopsis").text().trim(),
        poster: $("#poster_link > img").attr("data-src"),
        cast,
        movieInfo,
        whereToWatch,
        photos,
      };
    });

    return data;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default metaDataService;
