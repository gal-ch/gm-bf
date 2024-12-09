import { Order } from 'order/entities/order.entity';
import { Store } from 'store/entities/store.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Order, (order) => order.account)
  orders: Order[];

  @Column({ type: 'json', nullable: true })
  settings: object;

  @Column({ nullable: true })
  headImg: string;

  @OneToMany(() => Store, (store) => store.account)
  stores: Store[];

  @Column({ nullable: true })
  creditCompanyId: number;

  @Column({ nullable: true })
  creditApiKey: string;

  @Column()
  siteUrl: string
}
