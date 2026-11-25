import { runDistCheck } from "./lib/dist-check";
import { linkCheck } from "./lib/link-check";

await runDistCheck(linkCheck);
