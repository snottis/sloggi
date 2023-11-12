import { DataSource } from 'typeorm';
import { Sensor } from './model/Sensor';
import DataPoint from './model/DataPoint';
import DataPointType from './model/DataPointType';

export const ApplicationDataSource = new DataSource({
  type: 'sqlite',
  database: 'sloggi',
  synchronize: true,
  entities: [Sensor, DataPoint, DataPointType],
});

ApplicationDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.error(error));

export const sensorRepository = ApplicationDataSource.getRepository(Sensor);
export const dataPointRepository =
  ApplicationDataSource.getRepository(DataPoint);
export const dataPointTypeRepository =
  ApplicationDataSource.getRepository(DataPointType);

export default ApplicationDataSource;
