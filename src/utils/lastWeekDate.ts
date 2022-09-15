const lastWeekDate = () => {
  const today = new Date();
  const prevWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7
  );

  return prevWeek.getTime() / 1000;
};

export default lastWeekDate;
