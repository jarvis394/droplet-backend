import { Injectable } from '@nestjs/common'
import { File } from './interfaces/File'
import { Bucket, Storage } from '@google-cloud/storage'
import formatFiles from '../utils/formatFiles'
import { CloudActionResponse } from './interfaces/CloudActionResponse'
import * as path from 'path'

// Includes configuration file into dist/ folder
import '../config/storageCreds.json'

@Injectable()
export class StorageService {
	private bucket: Bucket
	constructor() {
		this.bucket = new Storage({
			keyFilename: path.resolve(__dirname, '../config/storageCreds.json'),
		}).bucket('my-droplet.appspot.com')
	}

	private async wrapCloudAction(func: () => Promise<any>) {
		try {
			const res = await func()
			return { done: true, ...res }
		} catch (e) {
			return {
				...e,
				done: false,
			}
		}
	}

	async findOne(filename: string): Promise<File> {
		const [files] = await this.bucket.getFiles({ prefix: filename })
		return formatFiles(files)[0]
	}

	async findAll(filename: string): Promise<File[]> {
		const [files] = await this.bucket.getFiles({ prefix: filename })
		return formatFiles(files)
	}

	async toggleStarred(filename: string): Promise<CloudActionResponse> {
		return await this.wrapCloudAction(async () => {
			const link = this.bucket.file(filename)
			const [metadata] = await link.getMetadata()
			const currentState = metadata.metadata?.isStarred === 'true'
			const [response] = await link.setMetadata({
				metadata: { isStarred: !currentState },
			})
			return { message: response.metadata }
		})
	}

	async rename(filename: string, name: string): Promise<CloudActionResponse> {
		return await this.wrapCloudAction(async () => {
			await this.bucket.file(filename).move(name)
		})
	}

	async move(filename: string, dest: string): Promise<CloudActionResponse> {
		return await this.wrapCloudAction(async () => {
			await this.bucket.file(filename).move(dest)
		})
	}

	async delete(filename: string): Promise<CloudActionResponse> {
		return await this.wrapCloudAction(async () => {
			await this.bucket.file(filename).delete()
		})
	}
}
