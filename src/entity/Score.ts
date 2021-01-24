import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({name: "Scores"})
export class Score {

    @PrimaryGeneratedColumn()
    // @ts-ignore
    id: number;

    @Column()
    // @ts-ignore
    Score: number;

    @Column()
    // @ts-ignore
    Name: string;

    @Column()
    // @ts-ignore
    Date: Date;

}
