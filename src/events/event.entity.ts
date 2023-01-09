import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export enum EventStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  DECLINED = 'Declined',
}

export enum EventType {
  REMOTEWORK = 'RemoteWork',
  PAIDLEAVE = 'PaidLeave',
}

@Entity('Event')
export class Event {
  @PrimaryColumn('uuid')
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column()
  public date!: Date;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PENDING,
  })
  public eventStatus?: EventStatus;

  @Column({
    type: 'enum',
    enum: EventType,
  })
  public eventType!: EventType;

  @Column()
  public eventDescription?: string;

  @Column({ type: 'uuid' })
  public userId!: string;
}
