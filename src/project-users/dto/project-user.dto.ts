import { IsDate, IsUUID } from 'class-validator';

export class ProjectUserDto {
  @IsDate()
  startDate!: Date;

  @IsDate()
  endDate!: Date;

  @IsUUID()
  userId!: string;

  @IsUUID()
  projectId!: string;
}
