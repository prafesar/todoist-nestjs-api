import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { configValidationSchema } from './config.schema';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectModule } from './projects/project.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { NotifyModule } from './notify/notify.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRoot(),
    PassportModule,
    UsersModule,
    AuthModule,
    ProjectModule,
    TasksModule,
    CommentsModule,
    NotifyModule
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}
