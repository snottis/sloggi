export interface SensorData {
  device: string;
  time: Date;
  data: Record<string, number>;
}
