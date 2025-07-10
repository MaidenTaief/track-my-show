import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Booking } from './Booking';
import { Review } from './Review';
import { Show } from './Show';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  gender?: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ default: 'active' })
  status: 'active' | 'inactive' | 'suspended';

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    favoriteCategories: string[];
    preferredLocations: string[];
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @ManyToMany(() => Show)
  @JoinTable({ name: 'user_wishlists' })
  wishlist: Show[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 