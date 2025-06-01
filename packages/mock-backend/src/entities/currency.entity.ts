import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Currency {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ length: 3, unique: true })
    code!: string;

    @Column({ length: 100 })
    name!: string;

    @Column("decimal", { precision: 10, scale: 4, default: 1 })
    rate!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 