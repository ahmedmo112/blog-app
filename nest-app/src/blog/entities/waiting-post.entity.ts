import { Post } from './blog.entity';

export class WaitingPost {
  id: number;
  postId: number;
  requestedAt: Date;
  post: Post;
}
