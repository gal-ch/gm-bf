import { Account } from 'account/entities/account.entity';
import { Store } from 'store/entities/store.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;

  @Column('json')
  details: {
    productName: string;
    productId: number,
    amount: number;
    price: number;
  }[];

  @ManyToOne(() => Account, (account) => account.orders, { nullable: true })
  account: Account;

  @Column()
  client: string;

  @Column({ nullable: true })
  clientEmail: string;

  @Column({ nullable: true })
  clientPhoneNumber: string;

  @ManyToOne(() => Store, { nullable: true })
  store: Store;

  @Column({ default: true})
  open: boolean;
}
