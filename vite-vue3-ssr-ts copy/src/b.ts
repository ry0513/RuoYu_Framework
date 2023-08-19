/*test.ts*/
require("ts-node/register");
import { test1, test2, Test } from "./test.js";

console.log(test1);
console.log(test2("函数"));
new Test();
