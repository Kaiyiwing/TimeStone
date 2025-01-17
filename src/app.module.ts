import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './modules/user/user.module';
import { CorsMiddleware } from './common/middlewares/cors.middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';
@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.register({ folder: './config' })],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: true, // 添加 ssl 配置
        extra: {
          sslmode: 'require', // 设置 sslmode 为 require
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware).forRoutes('*');
  }
}
