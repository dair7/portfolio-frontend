import { runDistCheck } from "./lib/dist-check";
import { todoCheck } from "./lib/todo-check";

await runDistCheck(todoCheck);
