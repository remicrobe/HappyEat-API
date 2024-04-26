import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Vote} from "./vote";

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    emoji: string;

    @OneToMany(() => Vote, (vote) => vote.restaurant)
    vote: Vote[]
}