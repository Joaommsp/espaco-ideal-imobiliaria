/* eslint-disable prettier/prettier */
import { CreateScheduleDto } from './create-schedule.dto';

export interface UpdateScheduleDto extends Partial<CreateScheduleDto> {
  id: number;
}
