import { Module } from '@nestjs/common'
import { StorageController } from './storage/storage.controller'
import { StorageService } from './storage/storage.service';

@Module({
    imports: [],
    controllers: [StorageController],
    providers: [StorageService],
})
export class AppModule {}
