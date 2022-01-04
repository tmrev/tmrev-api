const OrdinalImage = (imdbImage: string | null | undefined) => {
  if (!imdbImage) return '';

  const array = imdbImage.split('.');
  array[3] = '_V1_';

  return array.join('.');
};

export default OrdinalImage;
