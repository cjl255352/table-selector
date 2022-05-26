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
      on={{ click: () => close(options) }}
    />
  );
  return vnode;
}

function initDialog(options, status = "enter") {
  const vnode = (
    <div
      class={{
        [`${options.classPrefix}-dialog`]: true,
        [`${options.classPrefix}-dialog-enter`]: status == "enter",
        [`${options.classPrefix}-dialog-leave`]: status == "leave",
      }}
      style={{ height: options.height, width: options.width }}
    >
      <div
        class={{ [`${options.classPrefix}-dialog-header`]: true }}
        style={{ textAlign: options.titlePosition }}
      >
        <span class={{ [`${options.classPrefix}-title`]: true }}>
          {options.title}
        </span>
        {initCloseBtn(options)}
      </div>
    </div>
  );
  return vnode;
}

function initCloseBtn(isHover = false) {
  const vnode = (
    <div
      class={{ "flow-select-close": true, "is-hover": isHover }}
      on={{
        click: close,
        mouseover: (e, vnode) => {
          patch(vnode, initCloseBtn(!isHover));
        },
        mouseleave: (e, vnode) => {
          patch(vnode, initCloseBtn(!isHover));
        },
      }}
    >
      <i class={{ "table-selector-iconfont": true, "table-selector-icon-close": true }} />
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

function close(options) {
  destroy(patch(wrapper, initWrapper(options, "leave")), 200);
  destroy(patch(dialog, initDialog(options, "leave")), 300);
}

export { open, close };
