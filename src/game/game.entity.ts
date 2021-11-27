import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: number;

  @Column()
  players: number;

  @Column()
  laws: boolean;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  winner: number;
}