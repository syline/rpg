import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { CharactersModule } from './characters/characters.module';
import { FightsModule } from './fights/fights.module';

@Module({
  imports: [
    UsersModule,
    AuthenticationModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    CharactersModule,
    FightsModule,
  ],  
  controllers: [],
  providers: [],
})
export class AppModule { }
