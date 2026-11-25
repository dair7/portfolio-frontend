import { runDistCheck } from "./lib/dist-check";
import { linkCheck } from "./lib/link-check";
import { todoCheck } from "./lib/todo-check";

for (const check of [todoCheck, linkCheck]) {
  await runDistCheck(check);
}
