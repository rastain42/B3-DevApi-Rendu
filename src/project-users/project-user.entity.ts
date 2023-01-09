import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('uuid')
  @IsNotEmpty()
  public id!: string;

  @Column()
  public startDate!: Date;

  @Column()
  public endDate!: Date;

  @Column({ type: 'uuid' })
  public projectId!: string;

  @Column({ type: 'uuid' })
  public userId!: string;
}
