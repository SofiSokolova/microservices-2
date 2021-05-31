import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Config } from '../../core/config';

@Injectable()
export class HashService {
  constructor(private config: Config) {}

  async generateHash(
    str: string,
    saltRound = this.config.hash.saltRound,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRound);
    return bcrypt.hash(str, salt);
  }

  async compareHashes(hash1: string, hash2: string): Promise<boolean> {
    return bcrypt.compare(hash1, hash2);
  }
}
