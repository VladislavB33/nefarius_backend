import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface GameCreationAttr{
  players: number;
  name: string;
  password?: string;

}

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false})
  status: number;

  @Column({ nullable: false})
  players: number;

  @Column({ nullable: false})
  laws: boolean;

  @Column({ unique: true, nullable: false})
  name: string;

  @Column({ nullable: true})
  password: string;

  @Column({ nullable: false})
  winner: string;

}