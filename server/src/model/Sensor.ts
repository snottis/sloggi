import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

export class SensorDTO {
  name: string;
}
