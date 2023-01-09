import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UsersServices } from './services/user.service';

export enum Role {
  EMPLOYEE = 'Employee',
  ADMIN = 'Admin',
  PROJECTMANAGER = 'ProjectManager',
}

@Entity('user')
export class User {

  @PrimaryGeneratedColumn('uuid')
  public id!: string; //au format uuidv4

  @Column({ unique: true })
  public username!: string; // cette propriété doit porter une contrainte d'unicité
  @Column({ unique: true })
  @IsEmail()
  public email!: string; // cette propriété doit porter une contrainte d'unicité
  @Column()
  public password!: string;
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.EMPLOYEE,
  })
  public role!: Role;
}
