const commonListElement = (arr: (string | undefined)[]) => {
  if (!arr) return;

  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
};

export default commonListElement;
