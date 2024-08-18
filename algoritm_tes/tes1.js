const string = "Negie1";

const reverseString = (string) => {
  const result = [];
  const numbers = [];

  for (let i = string.length - 1; i >= 0; i--) {
    const char = string[i];
    if (!isNaN(char)) {
      numbers.push(char);
    } else {
      result.push(char);
    }
  }

  return result.join("") + numbers.join("");
};

console.log(reverseString(string));
