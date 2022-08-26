import dayjs from "dayjs";

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

export { camelize, timestamp };
