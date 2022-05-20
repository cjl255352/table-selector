import _ from "lodash";
import "./style.scss";
import Print from "./test";

function component() {
  const element = document.createElement("div");

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(["Hello", "webpack"], " ");
     element.classList.add("hello");
     console.log(1)
  element.onclick = Print.bind(null, "Hello webpack!");
  return element;
}

document.body.appendChild(component());
