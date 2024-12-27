import { Account } from 'account/entities/account.entity';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { Store } from 'store/entities/store.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  type: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Account, { nullable: true })
  account: Account;

  @Column()
  status: boolean;

  @Column()
  unit: string;

  @Column('int', { array: true, default: [] })
  disabledStoresIds: number[];

  @Column({ nullable: true })
  description: string;


}
