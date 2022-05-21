import "./style.scss";

const component = () => {
  const a = [1, 2, 3];
  const set = new Set([1, 2, 3]);
  [1, 2, 3].includes(2);
  const b = () => {
    return a;
  };
  console.log(...b);
};

component();
