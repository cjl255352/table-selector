// eslint-disable-next-line no-unused-vars
import { patch, h, jsx, initOptions, destroy, getMountPoint } from "@/libs";
import "@/style/index.scss";

let wrapper;
let dialog;

function initWrapper(options, status = "enter") {
  const vnode = (
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

function close() {
  patch(wrapper, h("!"));
  patch(dialog, h("!"));
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

function initDialog(options, status = "enter") {
  const vnode = (
    <div
      class={{
        [`${options.classPrefix}-dialog`]: true,
        [`${options.classPrefix}-dialog-enter`]: status == "enter",
        [`${options.classPrefix}-dialog-leave`]: status == "leave",
      }}
      style={{
        height: "300px",
        width: "50%",
        marginTop: "15vh",
      }}
    >
      {closeBtn()}
    </div>
  );
  return vnode;
}

function open(options = {}) {
  options = initOptions(options);
  const [wrapperPoint, dialogPoint] = getMountPoint(2);
  wrapper = initWrapper(options);
  dialog = initDialog(options);
  patch(wrapperPoint, wrapper);
  patch(dialogPoint, dialog);
}

export { open, close };
