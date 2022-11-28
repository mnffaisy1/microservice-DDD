import { Expose, Transform, TransformFnParams } from "class-transformer";
import {
  IsMongoId,
  IsString,
  MinLength
} from "class-validator";

export class PostDTO {
  @Expose()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(1)
  @IsString()
  public author: string;

  @Expose()
  @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
  public title: string;

  @Expose()
  @MinLength(6)
  @IsString()
  public body: string;
}

export class PostUpdateDTO extends PostDTO {
  @Expose()
  @MinLength(1)
  @IsMongoId({ message: "Invalid id" })
  public id: string;
}
