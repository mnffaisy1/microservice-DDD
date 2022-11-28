import { Expose, Transform, TransformFnParams } from "class-transformer";
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength
} from "class-validator";

export class UserDTO {
  @Expose()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(1)
  @IsString()
  @IsOptional()
  public name: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
  @IsOptional()
  @IsEmail()
  public email: string;

  @Expose()
  @IsOptional()
  @MinLength(6)
  @IsString()
  public password: string;
}
export class UserSignUpDTO {
  @Expose()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(1)
  @IsString()
  public name: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
  @MinLength(1)
  @IsEmail()
  public email: string;

  @Expose()
  @MinLength(6)
  @IsString()
  public password: string;
}

export class UserUpdateDTO extends UserDTO {
  @Expose()
  @MinLength(1)
  @IsMongoId({ message: "Invalid id" })
  public id: string;
}

export class SavePostDTO {
  @Expose()
  @MinLength(1)
  @IsMongoId({ message: "Invalid Post id" })
  public postId: string;
}