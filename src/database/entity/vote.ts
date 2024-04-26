import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {JoinColumn, JoinTable} from "typeorm/browser";
import {User} from "./user.entity";
import {Restaurant} from "./restaurant.entity";

@Entity()
export class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.vote)
    restaurant: Restaurant

    @ManyToOne(() => User, (user) => user.vote)
    user: User


}