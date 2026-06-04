// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { getDatabaseConfig } from '@/config/database.config';
// import { SessionModule } from '@/modules/session/session.module';
// import { PlayerModule } from '@/modules/player/player.module';
// import { GameModule } from '@/modules/game/game.module';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: '.env',
//     }),
//     TypeOrmModule.forRootAsync({
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) =>
//         getDatabaseConfig(configService),
//     }),
//     SessionModule,
//     PlayerModule,
//     GameModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
