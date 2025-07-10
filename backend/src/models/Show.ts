import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Venue } from './Venue';
import { Organizer } from './Organizer';
import { Category } from './Category';
import { ShowSchedule } from './ShowSchedule';
import { Booking } from './Booking';
import { Review } from './Review';

@Entity('shows')
export class Show {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  titleBangla?: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  story?: string;

  @Column('uuid')
  venueId: string;

  @Column('uuid')
  organizerId: string;

  @Column('uuid')
  categoryId: string;

  @Column('jsonb')
  images: {
    poster: string;
    gallery: string[];
    banner?: string;
  };

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ nullable: true })
  durationMinutes?: number;

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: true })
  ageRestriction?: string;

  @Column({ default: 'draft' })
  status: 'draft' | 'published' | 'cancelled' | 'completed';

  @Column({ type: 'timestamp', nullable: true })
  bookingStartsAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  bookingEndsAt?: Date;

  @ManyToOne(() => Venue, venue => venue.shows)
  venue: Venue;

  @ManyToOne(() => Organizer, organizer => organizer.shows)
  organizer: Organizer;

  @ManyToOne(() => Category, category => category.shows)
  category: Category;

  @OneToMany(() => ShowSchedule, schedule => schedule.show)
  schedules: ShowSchedule[];

  @OneToMany(() => Booking, booking => booking.show)
  bookings: Booking[];

  @OneToMany(() => Review, review => review.show)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 