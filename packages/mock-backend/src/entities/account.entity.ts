import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Account {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("int")
    ownerId!: number;

    @Column({ length: 100 })
    ownerName!: string;

    @Column({ length: 200 })
    ownerAddress!: string;

    @Column({ length: 3 })
    currency!: string;

    @Column("decimal", { precision: 20, scale: 4, default: 0 })
    balance!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
} 