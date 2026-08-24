import { string, number, date, addMethod } from "yup";

// 自行新增驗證規則
// addMethod(string, "demo", function (message) {
//   return this.test("demo", message, function (value) {
//     const { path, createError } = this;
//     return (
//       value === "demo" || createError({ path, message: message ?? "請輸入 demo" })
//     );
//   });
// });