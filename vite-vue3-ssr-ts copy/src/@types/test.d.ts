/*test.d.ts*/
//声明模块(被匹配的文件都属于该模块)
declare module "*/test.js" {
  //声明变量类型
  export const test1: string;
  //声明函数类型
  export function test2(name: string): string;

  //声明class接口
  interface Tests {
    name: string;
    //new()代表构造函数
    new (): Tests;
  }
  //声明class类型
  export const Test: Tests;
}
