const convertOrder = (order: "asc" | "desc" | string) => {
  if (order === "asc") return 1;
  if (order === "desc") return -1;

  return 0;
};

export default convertOrder;
