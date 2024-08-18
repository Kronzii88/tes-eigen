const input = ["xc", "dz", "bbb", "dz"];
const query = ["bbb", "ac", "dz"];

const countWords = (inputArr, queryArr) => {
  let result = [];

  for (const queryWord of queryArr) {
    let count = 0;

    for (const inputWord of inputArr) {
      if (queryWord === inputWord) {
        count++;
      }
    }

    // Tambahkan jumlah kemunculan ke dalam array hasil
    result.push(count);
  }

  return result;
};

console.log(countWords(input, query));
