import "./style.scss";

function component() {
  const element = document.createElement("div");

  element.innerHTML = "Hello webpack";
  element.classList.add("hello");
  return element;
}

document.body.appendChild(component());
