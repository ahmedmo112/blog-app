import { IsOptional, IsString, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Length(3, 50)
  @IsOptional()
  title: string;

  @IsString()
  @Length(20, 255)
  @IsOptional()
  content: string;
}
