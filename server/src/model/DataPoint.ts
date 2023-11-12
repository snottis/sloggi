import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sensor } from './Sensor';
import { DataPointType } from './DataPointType';
import { Type } from 'class-transformer';

@Entity()
export class DataPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  value: number;

  @Column()
  time: Date;

  @ManyToOne(() => Sensor)
  sensor: Sensor;

  @ManyToOne(() => DataPointType)
  type: DataPointType;
}

export default DataPoint;
