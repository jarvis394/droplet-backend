import { Controller, Post, Body } from '@nestjs/common'
import { StorageService } from './storage.service'
import { File } from './interfaces/File'
import { FindFileDto } from './dto/findFile'
import { FindAllDto } from './dto/findAll'
import { ToggleStarredDto } from './dto/toggleStarred'
import { CloudActionResponse } from './interfaces/CloudActionResponse'
import { FileRenameDto } from './dto/fileRename'
import { FileMoveDto } from './dto/fileMove'
import { FileDeleteDto } from './dto/fileDelete'

@Controller('storage')
export class StorageController {
	constructor(private readonly storageService: StorageService) {}

	/**
	 * Finds one file by its filename and returns as File
	 * @param filename File name
	 */
	@Post('findOne')
	findOne(@Body() { filename }: FindFileDto): Promise<File> {
		return this.storageService.findOne(filename)
	}

	/**
	 * Finds all files in storage by filenameand returns them as File[]
	 * @param filename File name
	 */
	@Post('findAll')
	findAll(@Body() { filename }: FindAllDto): Promise<File[]> {
		return this.storageService.findAll(filename)
	}

	/**
	 * Stars a file by its filename
	 * @param filename File name
	 */
	@Post('toggleStarred')
	toggleStarred(@Body() { filename }: ToggleStarredDto): Promise<CloudActionResponse> {
		return this.storageService.toggleStarred(filename)
	}

	/**
	 * Renames a file
	 * @param filename File name
	 * @param updatedName New filename
	 */
	@Post('rename')
	rename(@Body() { filename, updatedName }: FileRenameDto): Promise<CloudActionResponse> {
		return this.storageService.rename(filename, updatedName)
	}

	/**
	 * Moves a file
	 * @param filename File name
	 * @param destination New filename
	 */
	@Post('move')
	move(@Body() { filename, destination }: FileMoveDto): Promise<CloudActionResponse> {
		return this.storageService.move(filename, destination)
	}

	/**
	 * Deletes a file
	 * @param filename File name
	 */
	@Post('delete')
	delete(@Body() { filename }: FileDeleteDto): Promise<CloudActionResponse> {
		return this.storageService.delete(filename)
	}
}
