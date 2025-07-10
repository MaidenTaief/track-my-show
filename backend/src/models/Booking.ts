import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Show } from './Show';
import { ShowSchedule } from './ShowSchedule';
import { BookingSeat } from './BookingSeat';
import { Payment } from './Payment';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  showId: string;

  @Column('uuid')
  scheduleId: string;

  @Column({ unique: true })
  bookingNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'BDT' })
  currency: string;

  @Column({ default: 'pending' })
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  @Column({ default: 'pending' })
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ nullable: true })
  paymentReference?: string;

  @Column({ nullable: true })
  qrCode?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  bookedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => User, user => user.bookings)
  user: User;

  @ManyToOne(() => Show, show => show.bookings)
  show: Show;

  @ManyToOne(() => ShowSchedule, schedule => schedule.bookings)
  schedule: ShowSchedule;

  @OneToMany(() => BookingSeat, seat => seat.booking)
  seats: BookingSeat[];

  @OneToMany(() => Payment, payment => payment.booking)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 