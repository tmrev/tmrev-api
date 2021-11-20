import axios from 'axios';
import request from 'request-promise';

export const movePosterService = async (imdbID: string) => {
  try {
    const options = {
      url: `http://img.omdbapi.com/?i=${imdbID}&h=600&apikey=8a6ad534`,
    };

    const data = await axios.get(options.url);

    console.log(data);

    return data.data;
  } catch (err) {
    throw err;
  }
};
