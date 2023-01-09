import { IsNotEmpty, IsUUID } from 'class-validator';
import { EventType } from '../event.entity';

export class EventDto {
  @IsNotEmpty()
  date!: Date;

  eventDescription?: string;

  @IsNotEmpty()
  eventType!: EventType;

  @IsUUID()
  userId!: string;
}
