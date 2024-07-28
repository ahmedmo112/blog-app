import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Errors } from 'src/Errors/error-messages';
import { User } from 'src/auth/entities/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  PaginatedResult,
  PaginateFunction,
  paginator,
} from 'src/pagination/paginator';
import { Post } from './entities/blog.entity';
import { PostStatus } from '@prisma/client';

const paginate: PaginateFunction = paginator({ perPage: 3 });

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('blog-publish-mail') private publishMailQueue: Queue,
  ) {}

  async getPublishedPosts(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<Post>> {
    return paginate(
      this.prisma.post,
      {
        where: {
          published: true,
        },
      },
      {
        page,
        perPage,
      },
    );
  }

  async getAllPosts(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<Post>> {
    return await paginate(
      this.prisma.post,
      {},
      {
        page,
        perPage,
      },
    );
  }

  async getPostById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
        published: true,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async createPost(createPostDto: CreatePostDto, authorId: number) {
    const newPost = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        autherId: authorId,
        image: createPostDto.image,
      },
    });

    return newPost;
  }

  async updatePost(
    postId: number,
    autherId: number,
    updatePostDto: UpdatePostDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.autherId !== autherId) {
      throw new NotFoundException(Errors.NotAuther);
    }

    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
        updatedAt: new Date(),
      },
    });

    return updatedPost;
  }

  async deletePost(postId: number, autherId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.autherId !== autherId) {
      throw new NotFoundException(Errors.NotAuther);
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
        autherId: autherId,
      },
    });

    return {
      message: 'Post deleted successfully',
    };
  }

  async publishPost(postId: number, autherId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (post.autherId !== autherId) {
      throw new NotFoundException(Errors.NotAuther);
    }

    const waitingPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (waitingPost.status === PostStatus.WAITING) {
      throw new HttpException('Post is already waiting for admin approve', 400);
    }

    await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: PostStatus.WAITING,
        requestedAt: new Date(),
      },
    });

    const message = {
      message: 'Post is waiting for admin approve',
    };

    return message;
  }

  async getWaitingPosts(
    page: number,
    perPage: number,
  ): Promise<PaginatedResult<Post>> {
    const posts: PaginatedResult<Post> = await paginate(
      this.prisma.post,
      {
        where: {
          status: PostStatus.WAITING,
        },
        orderBy: {
          requestedAt: 'asc',
        },
      },
      {
        page,
        perPage,
      },
    );
    return posts;
  }

  async approvePost(postId: number) {
    const waitingPost = await this.prisma.post.findFirst({
      where: {
        id: postId,
      },
    });

    if (!waitingPost || waitingPost.status !== PostStatus.WAITING) {
      throw new HttpException('Post is not waiting for admin approve', 400);
    }

    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        published: true,
        status: PostStatus.PUBLISHED,
      },
      include: {
        author: true,
      },
    });

    muser: User;

    const user: User = updatedPost.author;
    await this.publishMailQueue.add('publish-mail', {
      user,
      postTitle: updatedPost.title,
    });

    return {
      message: 'Post approved successfully',
    };
  }

  async getUserPosts(
    page: number,
    perPage: number,
    userId: number,
  ): Promise<PaginatedResult<Post>> {
    return await paginate(
      this.prisma.post,
      {
        where: {
          autherId: userId,
        },
      },
      {
        page,
        perPage,
      },
    );
  }
}
