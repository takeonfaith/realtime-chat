const twoDigitForma = (num: number) => {
  return num <= 9 ? `0${num}` : num;
};

export default twoDigitForma;
