import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpErrorFilter } from 'filters/any-http-exception.filter';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';
import { contextMiddleware } from './middlewares';
import { FeedbackModule } from 'modules/feedback/feedback.module';
import { ConfigService } from 'shared/services/config.service';
import { SharedModule } from 'shared/shared.module';
import './boilerplate.polyfill';
import { AppService } from 'app.service';
import { AppController } from 'app.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register(),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    FeedbackModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}
