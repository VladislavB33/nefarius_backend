import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

interface PlayerCreationAttrs{
  name: string
  email: string;
  password: string;
}

@Entity()
export class Player {
  @ApiProperty({example:'1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({example: 'example', description: 'Уникальное имя'})
  @Column({ unique: true, nullable: false })
  name: string;

  @ApiProperty({example:'example@mail.com', description: 'Уникальный email'})
  @Column({ unique: true, nullable: false})
  email: string;

  @ApiProperty({example:'12345678', description: 'Пароль пользователя'})
  @Column({ nullable: false})
  password: string;

}