import "reflect-metadata";
import koa from "koa";
import bodyparser from "@koa/bodyparser";
import "./data-source";

import router from "./routes";

const app = new koa();

app.use(bodyparser());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(8000);
