// eslint-disable-next-line no-unused-vars
import { patch, h, jsx, initOptions } from "@/libs";
import "@/style/index.scss";

function destroy(vnode, delay = 0) {
  setTimeout(() => {
    patch(vnode, h("!"));
  }, delay);
}

function initWrapper(options, status = "enter") {
  let vnode = (
    <div
      class={{
        [`${options.classPrefix}-wrapper`]: true,
        [`${options.classPrefix}-wrapper-enter`]: status == "enter",
        [`${options.classPrefix}-wrapper-leave`]: status == "leave",
      }}
      on={{
        click: () => {
          destroy(patch(vnode, initWrapper(options, "leave")), 200);
        },
      }}
    />
  );
  return vnode;
}

let wrapper;
let dialog;

function getMountPoint(count = 1) {
  const fragment = document.createDocumentFragment();
  const list = [];
  for (let i = 0; i < count; i++) {
    const point = document.createElement("div");
    fragment.appendChild(point);
    list.push(point);
  }
  document.body.appendChild(fragment);
  return count === 1 ? list[0] : list;
}

function close() {
  patch(wrapper, h("!"));
  patch(dialog, h("!"));
}

// let closeBtn = (isHover = false) => {
//   return (
//     <div
//       class={{ "flow-select-close": true, "is-hover": isHover }}
//       on={{
//         click: close,
//         mouseover: (e, vnode) => {
//           patch(vnode, closeBtn(!isHover));
//         },
//         mouseleave: (e, vnode) => {
//           patch(vnode, closeBtn(!isHover));
//         },
//       }}
//     />
//   );
// };

// function initDialog() {
//   return (
//     <div class={{ "flow-select-dialog": true }}>
//       <div class={{ "flow-select-header": true }}>
//         <span class={{ "flow-select-title": true }}>流程选择</span>
//         {closeBtn()}
//       </div>
//       <div class={{ "flow-select-filter": true }}>
//         <input
//           class={{ "flow-select-keyword": true }}
//           attrs={{ placeholder: "请输入关键字" }}
//         />
//         <div
//           class={{ "flow-select-search": true }}
//           on={{
//             click: (e) => {
//               console.log(e);
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// }

function open(options = {}) {
  options = initOptions(options);
  console.log(options);
  const wrapperPoint = getMountPoint();
  wrapper = initWrapper(options);
  // dialog = initDialog();
  patch(wrapperPoint, wrapper);
  // patch(dialogPoint, dialog);
}

export { open, close };
