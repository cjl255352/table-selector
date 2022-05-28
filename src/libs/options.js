import mock from "./mock";

export default {
  classPrefix: "table-selector",
  height: "300px",
  width: "50%",
  title: "流程选择",
  titlePosition: "left",
  searchPlaceholder: "请输入关键字",
  columns: [
    {
      label: "序号",
      prop: "$index",
      headerAlign: "center",
      align: "center",
    },
    {
      label: "PDMC领域",
      prop: "domain",
    },
    {
      label: "电子流名称",
      prop: "name",
    },
    {
      label: "电子流owner",
      prop: "owner",
    },
  ],
  searchMethod: mock,
};
