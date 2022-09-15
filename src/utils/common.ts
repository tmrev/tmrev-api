import dayjs from "dayjs";
import { AdvancedScore } from "../models/movieReviews";

function camelize(text: string) {
  let newTest = JSON.parse(JSON.stringify(text));

  newTest = newTest.replace(/[-_\s.]+(.)?/g, (_: unknown, c: string) =>
    c ? c.toUpperCase() : ""
  );
  return newTest.substring(0, 1).toLowerCase() + text.substring(1);
}

function timestamp() {
  return {
    nanoseconds: dayjs().valueOf(),
    seconds: dayjs().unix(),
  };
}

const generateUrl = (url: string, params: any) => {
  const myUrlWithParams = new URL(url);

  Object.keys(params).forEach((value) => {
    myUrlWithParams.searchParams.append(value, params[value]);
  });

  return myUrlWithParams.href;
};

const getAvg = (advancedScore: AdvancedScore) => {
  const allValues = Object.values(advancedScore);
  const sum = allValues.reduce((prev, curr) => prev + curr, 0) as number;

  return sum / allValues.length;
};

export { camelize, timestamp, generateUrl, getAvg };
