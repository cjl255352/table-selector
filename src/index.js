import "./style.scss";

function component() {
  const element = document.createElement("div");
  element.innerText = "hello word";
  element.classList.add("hello");

  return element;
}

document.body.appendChild(component());
