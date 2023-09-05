import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { applicationConfig } from 'src/config/app.config';
import { AddressesModule } from './addresses/addresses.module';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { WebhooksModule } from './webhooks/webhooks.module';
import { BrandsModule } from './brands/brands.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [applicationConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (appConfig: ConfigType<typeof applicationConfig>) => ({
        type: 'postgres',
        host: appConfig.database.host,
        port: appConfig.database.port,
        username: appConfig.database.username,
        password: appConfig.database.password,
        database: appConfig.database.databaseName,
        autoLoadEntities: true,
        migrationsTableName: 'migration',
        migrations: ['dist/migrations/**/*.js'],
        logging: false,
        cli: {
          migrationsDir: 'src/migration',
        },
        synchronize: false,
      }),
      inject: [applicationConfig.KEY],
    }),
    SendGridModule.forRootAsync({
      useFactory: async (appConfig: ConfigType<typeof applicationConfig>) => ({
        apiKey: appConfig.sendGridApiKey,
      }),
      inject: [applicationConfig.KEY],
    }),
    UserModule,
    AuthModule,
    AddressesModule,
    WebhooksModule,
    BrandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
