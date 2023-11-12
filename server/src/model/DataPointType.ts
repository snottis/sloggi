import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DataPointType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

export default DataPointType;
