import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { createPostSchema, updatePostSchema } from './schema/blog.zod-schema';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

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
  @UsePipes(new ZodValidationPipe(createPostSchema))
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
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
