import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { createPostSchema, updatePostSchema } from './schema/blog.zod-schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { UploaderService } from 'src/uploader/uploader.service';

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blogService: BlogService,
    private uploaderService: UploaderService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get('posts')
  async getPosts() {
    return this.blogService.getPosts();
  }

  @Get('post/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.getPostById(id);
  }

  @UseGuards(AuthGuard)
  @Post('post')
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @Body(new ZodValidationPipe(createPostSchema)) createPostDto: CreatePostDto,
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 2,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file?: Express.Multer.File,
  ) {
    if (file)
      createPostDto.image = (await this.uploaderService.uploadFile(file)).url;

    return this.blogService.createPost(createPostDto, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Put('post/:id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updatePostSchema)) updatePostDto: UpdatePostDto,
    @Request() req,
  ) {
    return this.blogService.updatePost(id, req.user.userId, updatePostDto);
  }

  @UseGuards(AuthGuard)
  @Delete('post/:id')
  async deletePost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.blogService.deletePost(id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Put('post/publish/:id')
  async publishPost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.blogService.publishPost(id, req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Get('myposts')
  async getMyPosts(@Request() req) {
    return this.blogService.getUserPosts(req.user.userId);
  }
}