import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

@Entity({ name: 'group' })
export class Group {
  @PrimaryColumn('char', { length: 36 })
  id: string = uuidv7();

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
