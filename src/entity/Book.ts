import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    isbn!: string;

    @Column()
    name!: string;

    @Column()
    author!: string;

    @Column({ nullable: true })
    pages?: number;

    @Column({ nullable: true })
    year?: number;

    @CreateDateColumn()
    addedOn!: Date;

    @Column({ default: false })
    isDeleted!: boolean;
}
