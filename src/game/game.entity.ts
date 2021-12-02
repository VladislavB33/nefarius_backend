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

  @Column()
  status: number;

  @Column()
  players: number;

  @Column()
  laws: boolean;

  @Column({unique: true, nullable: false})
  name: string;

  @Column()
  password: string;

  @Column()
  winner: number;

}