import ApplicationDataSource, { dataPointRepository } from '../data-source';
import DataPoint from '../model/DataPoint';
import DataPointType from '../model/DataPointType';
import { Sensor } from '../model/Sensor';
import { SensorData } from '../types';

export const getSensorData = async (
  sensorName?: string,
  type?: string,
  from?: Date,
  to?: Date,
) => {
  let queryBuilder = dataPointRepository.createQueryBuilder('dataPoint');
  queryBuilder = queryBuilder
    .leftJoinAndSelect('dataPoint.sensor', 'sensor')
    .where('sensor.id = dataPoint.sensorId')
    .leftJoinAndSelect('dataPoint.type', 'type')
    .where('type.id = dataPoint.typeId');
  if (sensorName) {
    queryBuilder = queryBuilder.where('sensor.name = :sensorName', {
      sensorName,
    });
  }
  if (type) {
    queryBuilder = queryBuilder.andWhere('type.name = :type', { type });
  }
  if (from) {
    queryBuilder = queryBuilder.andWhere('dataPoint.time >= :from', { from });
  }
  if (to) {
    queryBuilder = queryBuilder.andWhere('dataPoint.time <= :to', { to });
  }

  queryBuilder = queryBuilder
    .select([
      'dataPoint.time as time',
      'dataPoint.value as value',
      'sensor.name as device',
      'type.name as type',
    ])
    .orderBy('dataPoint.time', 'DESC');

  const result = await queryBuilder.getRawMany();
  return result;
};

export const postSensorData = async (sensordata: SensorData) => {
  const queryRunner =
    ApplicationDataSource.manager.connection.createQueryRunner();
  await queryRunner.connect();
  const manager = queryRunner.manager;
  try {
    await queryRunner.startTransaction();
    let sensor = await manager.findOneBy(Sensor, { name: sensordata.device });
    if (!sensor) {
      sensor = new Sensor();
      sensor.name = sensordata.device;
      await manager.save(sensor);
    }

    const result = await Promise.all(
      Object.keys(sensordata.data).map(async (key) => {
        let dataPointType = await manager.findOneBy(DataPointType, {
          name: key,
        });
        if (!dataPointType) {
          dataPointType = new DataPointType();
          dataPointType.name = key;
          await manager.save(dataPointType);
        }

        const dataPoint = new DataPoint();
        dataPoint.sensor = sensor as Sensor;
        dataPoint.type = dataPointType as DataPointType;
        dataPoint.value = sensordata.data[key];
        dataPoint.time = sensordata.time;
        await manager.save(dataPoint);
        return dataPoint;
      }),
    );
    await queryRunner.commitTransaction();
    return result;
  } catch (error) {
    console.error(error);
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};
