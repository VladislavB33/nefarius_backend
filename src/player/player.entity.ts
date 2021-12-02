import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface PlayerCreationAttrs{
  name: string
  email: string;
  password: string;
}

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true, nullable: false})
  name: string;

  @Column({unique: true, nullable: false})
  email: string;

  @Column({nullable: false})
  password: string;

  @Column({nullable: false})
  gamesPlayed: number;

  @Column({nullable: false})
  wins: number;

}