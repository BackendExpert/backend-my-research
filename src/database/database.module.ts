import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            connectionName: 'local',
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGO_URI'),
            }),
        }),

        // MongooseModule.forRootAsync({
        //     connectionName: 'server',
        //     inject: [ConfigService],
        //     useFactory: (config: ConfigService) => ({
        //         uri: config.get<string>('SERVER_MONGO_URI')
        //     })
        // })
    ],

    exports: [MongooseModule]
})
export class DatabaseModule { }