import Router from "@koa/router";

import apiV1Router from "./v1";

const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "Hello World from Root";
});
router.use("/api/v1", apiV1Router.routes(), apiV1Router.allowedMethods());

export default router;
