import {
  patch,
  h,
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
let table;

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
        {(() => {
          table = initTable(options);
          return table;
        })()}
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
            if (
              options.searchMethod &&
              typeof options.searchMethod === "function"
            ) {
              options.searchMethod(keyword, (data) => {
                searchDone(options, data);
              });
            }
          },
        }}
      >
        {icon("search")}
      </div>
    </div>
  );
  return vnode;
}

function initTable(options, rows = [{}, {}, {}]) {
  const vnode = h(
    "table",
    {
      class: { [`${options.classPrefix}-table`]: true },
    },
    (() => {
      const children = [];
      children.push(
        h(
          "tr",
          options.columns.map((e) => {
            return (
              <th
                class={{ [`${options.classPrefix}-table-header`]: true }}
                style={{ textAlign: e.headerAlign || "left" }}
              >
                {e.label}
              </th>
            );
          })
        )
      );
      rows.forEach((row) => {
        children.push(
          h(
            "tr",
            {
              on: {
                click: () => {
                  console.log(row);
                },
              },
            },
            options.columns.map((column) => {
              return (
                <td style={{ textAlign: column.align || "left" }}>
                  {row[column.prop]}
                </td>
              );
            })
          )
        );
      });
      return children;
    })()
  );
  return vnode;
}

function initSelected(options) {
  console.log(options);
}

function searchDone(options, data = {}) {
  const { rows } = data;
  const newVnode = initTable(options, rows);
  table = patch(table, newVnode);
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
