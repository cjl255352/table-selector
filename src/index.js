import {
  patch,
  // eslint-disable-next-line no-unused-vars
  jsx,
  initOptions,
  destroy,
  getMountPoint,
  icon,
} from "@/libs";
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
      {initHeader(options)}
      {initSearch(options)}
      <div class={{ [`${options.classPrefix}-body`]: true }}>
        {initTable(options)}
        {initSelected(options)}
      </div>
    </div>
  );
  return vnode;
}

function initHeader(options) {
  const vnode = (
    <div
      class={{ [`${options.classPrefix}-header`]: true }}
      style={{ textAlign: options.titlePosition }}
    >
      <span class={{ [`${options.classPrefix}-header-title`]: true }}>
        {options.title}
      </span>
      <div
        class={{ [`${options.classPrefix}-header-close-btn`]: true }}
        on={{ click: () => close(options) }}
      >
        {icon("close")}
      </div>
    </div>
  );
  return vnode;
}

function initSearch(options) {
  let keyword = "";
  const vnode = (
    <div class={{ [`${options.classPrefix}-search`]: true }}>
      <input
        class={{ [`${options.classPrefix}-search-keyword`]: true }}
        props={{ placeholder: options.searchPlaceholder }}
        on={{
          input: (e) => {
            keyword = e.target.value;
          },
        }}
      />
      <div
        class={{ [`${options.classPrefix}-search-btn`]: true }}
        on={{
          click: () => {
            console.log(keyword);
          },
        }}
      >
        {icon("search")}
      </div>
    </div>
  );
  return vnode;
}

function initTable(options) {
  console.log(options);
}

function initSelected(options) {
  console.log(options);
}

function open(options) {
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
