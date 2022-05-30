function mock(keyword, done) {
  console.log(`搜索关键字：${keyword}`);
  setTimeout(() => {
    done({
      rows: [
        {
          $index: 1,
          domain: "非洲业务部",
          name: "流程名称xxxxxxxxxxxxxxx111111111111111111111111111111",
          owner: "陈加隆",
        },
        {
          $index: 2,
          domain: "澳洲业务部",
          name: "流程名称xxxxxxxxxxxxxxx",
          owner: "陈加隆",
        },
        {
          $index: 3,
          domain: "美洲业务部",
          name: "流程名称xxxxxxxxxxxxxxx",
          owner: "陈加隆",
        },
        {
          $index: 4,
          domain: "亚洲业务部",
          name: "流程名称xxxxxxxxxxxxxxx",
          owner: "陈加隆",
        },
        {
          $index: 5,
          domain: "欧洲业务部",
          name: "流程名称xxxxxxxxxxxxxxx",
          owner: "陈加隆",
        },
      ],
    });
  }, 1000);
}

export default mock;
