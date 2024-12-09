import { Account } from 'account/entities/account.entity';
import { Order } from 'order/entities/order.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  manager: string;

  @Column()
  managerEmail: string;

  @Column()
  address: string;

  @Column()
  day: string;

  @Column()
  hour: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  status: boolean;

  @Column({ nullable: true })
  closingDay: string;

  @OneToMany(() => Order, (order) => order.store)
  orders: Order[];

  @ManyToOne(() => Account, (account) => account.stores)
  account: Account;
}
