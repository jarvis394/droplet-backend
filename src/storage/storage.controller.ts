import { Controller, Get, Post, Body } from '@nestjs/common'
import { StorageService } from './storage.service'
import { File } from './interfaces/file.interface'
import { FindFileDto } from './dto/find-file.dto'

@Controller('storage')
export class StorageController {
	constructor(private readonly storageService: StorageService) {}

	@Post('findOne')
	findOne(@Body() { filename }: FindFileDto): Promise<string> {
		return this.storageService.findOne(filename)
	}

	/**
	 * Finds all files in storage and returns them as File[]
	 */
	@Get('findAll')
	findAll(): Promise<File[]> {
		return this.storageService.findAll()
	}
}
