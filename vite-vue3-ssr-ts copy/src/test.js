/*test.js*/
//导出变量
export const test1 = "变量";
//导出函数
export function test2(name) {
  return name;
}
//导出类
export class Test3 {
  name = "类";
  constructor() {
    console.log(this.name);
  }
}
