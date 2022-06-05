let index = 0;

function mock(params, done) {
  index++;
  setTimeout(() => {
    if (index % 2) {
      done({
        total: 10,
        rows: [
          {
            $index: 1,
            id: 1,
            domain: "非洲业务部",
            name: "流程名称xxx非洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 2,
            id: 2,
            domain: "澳洲业务部",
            name: "流程名称xxx澳洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 3,
            id: 3,
            domain: "美洲业务部",
            name: "流程名称xxx美洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 4,
            id: 4,
            domain: "亚洲业务部",
            name: "流程名称xxx亚洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 5,
            id: 5,
            domain: "欧洲业务部",
            name: "流程名称xxx欧洲业务部",
            owner: "陈加隆",
          },
        ],
      });
    } else {
      done({
        total: 10,
        rows: [
          {
            $index: 6,
            id: 6,
            domain: "非洲业务部",
            name: "流程名称xxx非洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 7,
            id: 7,
            domain: "澳洲业务部",
            name: "流程名称xxx澳洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 8,
            id: 8,
            domain: "美洲业务部",
            name: "流程名称xxx美洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 9,
            id: 9,
            domain: "亚洲业务部",
            name: "流程名称xxx亚洲业务部",
            owner: "陈加隆",
          },
          {
            $index: 10,
            id: 10,
            domain: "欧洲业务部",
            name: "流程名称xxx欧洲业务部",
            owner: "陈加隆",
          },
        ],
      });
    }
  }, 1000);
}

export default mock;
