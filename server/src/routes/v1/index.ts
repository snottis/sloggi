import Router from "@koa/router";

import sensordata from './sensordata';

const router = new Router();

router.use("/sensordata", sensordata.routes(), sensordata.allowedMethods());

export default router;