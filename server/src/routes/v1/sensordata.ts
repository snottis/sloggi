import Router from '@koa/router';
import { SensorData } from '../../types';
import { getSensorData, postSensorData } from '../../service/sensordata';

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = await getSensorData();
});

router.post('/', async (ctx) => {
  const sensorDataBody: SensorData = ctx.request.body;
  ctx.body = await postSensorData(sensorDataBody);
  console.log(ctx.body);
});

export default router;
