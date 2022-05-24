// eslint-disable-next-line no-unused-vars
import { patch, h, jsx, test } from "@/libs";
import defaultOptions from "@/defaultOptions";
import cloneDeep from "lodash.clonedeep";
import "@/style/index.scss";

let wrapper;
let dialog;

test();

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

function initWrapper() {
  return <div class={{ "flow-select-wrapper": true }} on={{ click: close }} />;
}

let closeBtn = (isHover = false) => {
  return (
    <div
      class={{ "flow-select-close": true, "is-hover": isHover }}
      on={{
        click: close,
        mouseover: (e, vnode) => {
          patch(vnode, closeBtn(!isHover));
        },
        mouseleave: (e, vnode) => {
          patch(vnode, closeBtn(!isHover));
        },
      }}
    />
  );
};

function initDialog() {
  return (
    <div class={{ "flow-select-dialog": true }}>
      <div class={{ "flow-select-header": true }}>
        <span class={{ "flow-select-title": true }}>流程选择</span>
        {closeBtn()}
      </div>
      <div class={{ "flow-select-filter": true }}>
        <input
          class={{ "flow-select-keyword": true }}
          attrs={{ placeholder: "请输入关键字" }}
        />
        <div
          class={{ "flow-select-search": true }}
          on={{
            click: (e) => {
              console.log(e);
            },
          }}
        />
      </div>
    </div>
  );
}

function open(options = {}) {
  options = Object.assign(cloneDeep(defaultOptions), options);
  console.log(options);
  const [wrapperPoint, dialogPoint] = getMountPoint(2);
  wrapper = initWrapper();
  dialog = initDialog();
  patch(wrapperPoint, wrapper);
  patch(dialogPoint, dialog);
}

export { open, close };
