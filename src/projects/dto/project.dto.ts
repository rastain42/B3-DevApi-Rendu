import { IsEnum, IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class ProjectDto {
  @MinLength(3)
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  @IsNotEmpty()
  referringEmployeeId!: string;
}
