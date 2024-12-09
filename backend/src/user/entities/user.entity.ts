import { IsString, MaxLength, MinLength } from 'class-validator';
import { Order } from 'order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Column()
  password: string;

  @Column()
  create_at: Date;

  @Column()
  location: string;
}
