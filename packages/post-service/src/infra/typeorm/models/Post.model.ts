/* eslint-disable indent */
import { injectable } from "inversify";
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
@injectable()
export class Post {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  author: string;
  
  @Column()
  title: string;

  @Column()
  body: string;

  @CreateDateColumn({
    name: "createdAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updatedAt",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updatedAt: Date;
}
