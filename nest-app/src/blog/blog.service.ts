import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Errors } from 'src/Errors/error-messages';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/auth/entities/user.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UploaderService } from 'src/uploader/uploader.service';

@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    @InjectQueue('blog-publish-mail') private publishMailQueue: Queue,
  ) {}

  async getPosts() {
    const posts = await this.prisma.post.findMany({
      where: {
        published: true,
      },
    });
    return posts;
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

    const updatedPost = await this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        published: true,
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

    return updatedPost;
  }

  async getUserPosts(userId: number) {
    const posts = await this.prisma.post.findMany({
      where: {
        autherId: userId,
      },
    });

    return posts;
  }
}
