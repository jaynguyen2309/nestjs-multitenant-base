import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class ReadUserDto {
  @IsNumber()
  @Expose()
  readonly id: number;

  @IsString()
  @Expose()
  readonly username: string;
}
