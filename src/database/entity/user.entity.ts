import {Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Vote} from "./vote";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({default: null, nullable: true})
    username: string;

    @Column({ select: false })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ select: false })
    token: string;

    @Column({ select: false })
    refreshToken: string;

    @OneToMany(() => Vote, (vote) => vote.user)
    vote: Vote[]

    @CreateDateColumn({type: "timestamp", select: false})
    createdAt: Date;

    @Column({type: "timestamp", select: false})
    tokenCreatedAt: Date;

    @Column({type: "timestamp", select: false})
    refreshtokenCreatedAt: Date;
}