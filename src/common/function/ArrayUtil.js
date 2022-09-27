export function sortingArrayByTimestamp(arr) {
  return arr.sort((var1, var2) => {
    var a = new Date(var1.timestamp),
      b = new Date(var2.timestamp);
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }

    return 0;
  });
}
