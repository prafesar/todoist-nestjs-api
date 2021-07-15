import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotifyModule } from '../notify/notify.module';
import { UsersModule } from '../users/users.module';
import { CommentsController } from './comments.controller';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsRepository]),
    CommentsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule,
    AuthModule,
    NotifyModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsRepository, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
