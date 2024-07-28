import { IsOptional, IsString, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(3, 50)
  title: string;

  @IsString()
  @Length(20, 255)
  content: string;

  @IsString()
  @IsOptional()
  image?: string;
}
