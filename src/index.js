import {
  patch,
  h,
  // eslint-disable-next-line no-unused-vars
  jsx,
  initOptions,
  destroy,
  getMountPoint,
  icon,
  formatSize,
} from "@/libs";
import "@/style/index.scss";

let wrapper;
let dialog;
let dataTable;

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
        {initDataTable(options)}
        {initSelectedTable(options)}
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
        on={{ input: (e) => (keyword = e.target.value) }}
      />
      <div
        class={{ [`${options.classPrefix}-search-btn`]: true }}
        on={{
          click: () => {
            if (options.searchMethod && typeof options.searchMethod == "function") {
              options.searchMethod(keyword, (data) => searchDone(options, data));
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

function initTableHeader(options) {
  const vnode = (
    <div class={{ [`${options.classPrefix}-table-header-wrapper`]: true }}>
      {h(
        "table",
        {
          class: { [`${options.classPrefix}-table-header`]: true },
        },
        options.columns.map((e) => (
          <th style={{ textAlign: e.headerAlign, width: e.width }}>
            {e.label}
          </th>
        ))
      )}
    </div>
  );
  return vnode;
}

function initTableRow(options, row) {
  const vnode = h(
    "tr",
    {
      class: { [`${options.classPrefix}-table-row-selected`]: row.$selected },
      on: {
        click: () => {
          row.$selected = !row.$selected;
          patch(vnode, initTableRow(row));
        },
      },
    },
    options.columns.map((column) => {
      return (
        <td style={{ textAlign: column.align, width: column.width }}>
          {row[column.prop]}
        </td>
      );
    })
  );
  return vnode;
}

function initTableBody(options, rows) {
  const vnode = (
    <div class={{ [`${options.classPrefix}-table-body-wrapper`]: true }}>
      {h(
        "table",
        {
          class: { [`${options.classPrefix}-table-body`]: true },
        },
        rows.map((row) => initTableRow(options, row))
      )}
    </div>
  );
  return vnode;
}

function initDataTable(options, rows = []) {
  const vnode = (
    <div
      class={{ [`${options.classPrefix}-table`]: true }}
      style={{ width: formatSize(options.dataTableWidth) }}
    >
      {initTableHeader(options)}
      {initTableBody(options, rows)}
    </div>
  );
  if (!dataTable) {
    dataTable = vnode;
  }
  return vnode;
}

function initSelectedTable(options) {
  console.log(options);
}

function searchDone(options, data = {}) {
  const { rows } = data;
  const newVnode = initDataTable(options, rows);
  dataTable = patch(dataTable, newVnode);
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
  dataTable = undefined;
}

export { open, close };
