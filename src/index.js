import "./style.scss";

const component = () => {
  const a = [1, 2, 3];
  const b = () => {
    return a;
  };
  console.log(...b);
};

component();
