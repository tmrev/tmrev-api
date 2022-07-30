import dayjs from "dayjs";

function camelize(text: string) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    return text.substring(0, 1).toLowerCase() + text.substring(1);
}

function timestamp() {
    return {
        nanoseconds: dayjs().valueOf(),
        seconds: dayjs().unix()
    }
}

export {camelize, timestamp}