import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class CreateUserDto {
  @IsString()
  @Expose()
  readonly username: string;

  @IsString()
  @Expose()
  readonly password: string;

  @IsString()
  @IsEmail()
  @Expose()
  readonly email: string;
}
