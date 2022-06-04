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
  isFunction,
  isVnode,
} from "@/libs";
import "@/style/index.scss";

let wrapper;
let dialog;
let dataTable;
let selectedTable;

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
      style={{
        height: formatSize(options.height),
        width: formatSize(options.width),
      }}
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
            if (isFunction(options.searchMethod)) {
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

function initDataTable(options, rows = []) {
  const vnode = h(
    "div",
    {
      class: { [`${options.classPrefix}-table`]: true },
      style: { width: formatSize(options.dataTableWidth) },
    },
    initTable(options, options.columns, rows, rowClick)
  );
  if (!dataTable) {
    dataTable = vnode;
  }
  return vnode;
}

function initSelectedTable(options) {
  const vnode = h(
    "div",
    { class: { [`${options.classPrefix}-table`]: true }, style: { flex: 1 } },
    initTable(
      options,
      [
        {
          label: initClearBtn(options, options.value),
          prop: options.labelProp,
          width: "100%",
        },
      ],
      options.value
    )
  );
  if (!selectedTable) {
    selectedTable = vnode;
  }
  return vnode;
}

function initTable(options, columns, rows = [], rowClick) {
  const table = [];
  table.push(
    h(
      "div",
      {
        class: { [`${options.classPrefix}-table-header`]: true },
        style: { height: formatSize(options.tableRowHeight) },
      },
      columns.map((e) => (
        <div
          class={{ [`${options.classPrefix}-table-cell`]: true }}
          style={{ justifyContent: e.headerAlign, width: e.width }}
        >
          {isVnode(e.label) ? e.label : <span>{e.label}</span>}
        </div>
      ))
    )
  );
  rows.forEach((row) => {
    table.push(initTableRow(options, columns, row, rowClick));
  });
  table.push(<div class={{ [`${options.classPrefix}-table-empty`]: true }} />);
  return table;
}

function initTableRow(options, columns, row, rowClick) {
  const vnode = h(
    "div",
    {
      class: {
        [`${options.classPrefix}-table-row`]: true,
        [`${options.classPrefix}-table-row-selected`]:
          rowClick && row.$selected,
      },
      style: { height: formatSize(options.tableRowHeight) },
      on: {
        click: () => {
          if (isFunction(rowClick)) {
            rowClick(row, vnode, options, columns);
          }
        },
      },
    },
    columns.map((column) => (
      <div
        class={{ [`${options.classPrefix}-table-cell`]: true }}
        style={{ justifyContent: column.align, width: column.width }}
      >
        <span>{row[column.prop]}</span>
      </div>
    ))
  );
  return vnode;
}

function initClearBtn(options, rows) {
  return (
    <div class={{ [`${options.classPrefix}-selected-label`]: true }}>
      <span>已选择{`（${rows.length}）`}</span>
      <div
        class={{ [`${options.classPrefix}-selected-label-clear-btn`]: true }}
        on={{
          click: () => {
            options.value.forEach((e) => (e.$selected = false));
            options.value = [];
            selectedTable = patch(selectedTable, initSelectedTable(options));
            dataTable.children
              .slice(1, dataTable.children.length - 1)
              .forEach((e) => {
                e.key.$selected = false;
                patch(
                  e,
                  initTableRow(options, options.columns, e.key, rowClick)
                );
              });
          },
        }}
      >
        清空
      </div>
    </div>
  );
}

function rowClick(row, rowVnode, options, columns) {
  row.$selected = !row.$selected;
  const i = options.value.findIndex((e) => {
    return e[options.valueProp] == row[options.valueProp];
  });
  if (row.$selected) {
    i < 0 && options.value.push(row);
  } else {
    i > -1 && options.value.splice(i, 1);
  }
  patch(rowVnode, initTableRow(options, columns, row, rowClick));
  selectedTable = patch(selectedTable, initSelectedTable(options));
}

function searchDone(options, data = {}) {
  const { rows } = data;
  rows.forEach((e) => {
    if (
      options.value.find((f) => f[options.valueProp] == e[options.valueProp])
    ) {
      e.$selected = true;
    }
  });
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
  selectedTable = undefined;
}

export { open, close };
