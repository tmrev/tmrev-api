import cheerio, { CheerioAPI } from "cheerio";
import request from "request-promise";

const searchService = async (url: string) => {
  try {
    const options = {
      uri: url,
      transform: (body: string) => cheerio.load(body),
    };

    const data = request(options).then(($: CheerioAPI) => {
      const numberMoviesSearchData: any = [];

      $("a.poster").each((i, el) => {
        const element = cheerio.load(el);

        numberMoviesSearchData.push({
          url: element("a").attr("href"),
          uuid: element("a").attr("href")?.split("/")[4],
          title: element(".item-title").text().trim(),
          hd:
            element("span.mlbq").length &&
            element("span.mlbq").text().trim() === "HD",
        });
      });

      return numberMoviesSearchData;
    });

    return data;
  } catch (err) {
    return {
      success: false,
      error: err,
    };
  }
};

export default searchService;
