import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Show } from './Show';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text')
  address: string;

  @Column()
  city: string;

  @Column({ nullable: true })
  state?: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column()
  capacity: number;

  @Column('jsonb', { nullable: true })
  facilities?: string[];

  @Column('jsonb', { nullable: true })
  images?: string[];

  @Column('jsonb', { nullable: true })
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @OneToMany(() => Show, show => show.venue)
  shows: Show[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 