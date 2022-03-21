const lastWeekDate = () => {
    var today = new Date();
    var prevWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

    return prevWeek.getTime() / 1000
}


export default lastWeekDate