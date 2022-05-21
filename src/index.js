import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
  // eslint-disable-next-line no-unused-vars
  jsx,
} from "./snabbdom.esm.js";

const patch = init([
  // 通过传入模块初始化 patch 函数
  classModule, // 开启 classes 功能
  propsModule, // 支持传入 props
  styleModule, // 支持内联样式同时支持动画
  eventListenersModule, // 添加事件监听
]);

const container = document.getElementById("container");

const vnode = h(
  "div#container.two.classes",
  {
    on: {
      click: () => {
        console.log(1);
      },
    },
  },
  [
    h("span", { style: { fontWeight: "bold" } }, "This is bold"),
    " and this is just normal text",
    h("a", { props: { href: "/foo" } }, "I'll take you places!"),
  ]
);
// 传入一个空的元素节点 - 将产生副作用（修改该节点）
patch(container, vnode);

const node = (
  <div>
    <span>I was created with JSX</span>
  </div>
);

const newVnode = h(
  "div#container.two.classes",
  {
    on: {
      click: () => {
        console.log(2);
      },
    },
  },
  [
    h(
      "span",
      { style: { fontWeight: "normal", fontStyle: "italic" } },
      "This is now italic type"
    ),
    " and this is still just normal text",
    h("a", { props: { href: "/bar" } }, "I'll take you places!"),
    node,
  ]
);

function open() {
  // 再次调用 `patch`
  patch(vnode, newVnode);
}

export { open };
