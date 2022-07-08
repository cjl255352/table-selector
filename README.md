## 开发环境运行

```
npm run dev
```

---

## 编译

```
npm run build
```

---

## 引用

### vue 项目

```js
// 样式
import "table-selector/dist/main.css";

// 业务代码
import { open } from "table-selector";

// 使用
open(options);
```

### 原生

```html
<!-- 引入编译好的js与css -->
<script src="table-selector.js"></script>
<link rel="stylesheet" href="main.css" />

<!-- 使用 -->
tableSelector.open(options);
```

---

## options

### `classPrefix` (可选，`string`，默认值`"table-selector"`)

类名前缀，冲突时更改。

### `height` (可选，`number`或`string`，默认值`504`)

弹出层高度。

### `width` (可选，`number`或`string`，默认值`760`)

弹出层宽度。

### `title` (可选，`string`，默认值`"流程选择"`)

弹出层标题。

### `searchPlaceholder` (可选，`string`，默认值`"请输入关键字"`)

搜索框占位符。

### `tableRowHeight` (可选，`number`或`string`，默认值`32`)

表格每行的高度。

### `dataTableWidth` (可选，`number`或`string`，默认值`480`)

左侧数据表格的宽度。

### `pageCount` (可选，`number`，默认值`7`)

分页按钮最大显示数。

### `valueProp` (可选，`string`，默认值`"id"`)

右侧已选择表格的值的唯一字段的 key。

### `labelProp` (可选，`string`，默认值`"electronFlowName"`)

右侧已选择表格的值的显示字段的 key。

### `columns` (可选，`array`)

列描述数组。

```js
// 默认值
[
  // 每个对象代表一列
  {
    // 列表头
    label: "序号",
    // 列字段名
    prop: "$index",
    // 列宽，支持数字和字符串
    width: 60,
    // 表头对齐方式，默认left
    headerAlign: "center",
    // 表体对齐方式，默认left
    align: "center",
    // 格式化函数，参考el-table
    formatter: (row, column, cellValue, index) => {
      return index + 1;
    },
  },
  {
    label: "PDMC领域",
    prop: "domainInfo",
    width: 110,
  },
  {
    label: "电子流名称",
    prop: "electronFlowName",
  },
  {
    label: "电子流owner",
    prop: "ownerName",
    width: 100,
  },
];
```

_对齐方式可选：**`left`**，**`center`**，**`right`**。_

_没有设置列宽时会自动撑开，多个列均分。_

### `searchMethod` (必填，`function`)

搜索方法。

```js
// 例子
function searchMethod(params, done) {
  axios({
    method: "post",
    url: "/user/12345",
    data: {
      // 模糊搜索文本
      searchKey: params.keyword,
      // 页码，从1开始
      pageNumber: params.pageNumber,
      // 分页大小，默认10
      pageSize: params.pageSize,
    },
  }).then((result) => {
    if (result.status == 200) {
      // done方法告知组件请求完成
      done({
        // 数组
        rows: result.data,
        // 总条数，默认0
        total: result.total,
      });
    }
  });
}
```

### `confirm` (必填，`function`)

确定按钮方法。

```js
// 例子
function confirm(value, close) {
  // value为选择的值的数组
  // 关闭弹窗
  close();
}
```

---
