import { Injectable } from '@nestjs/common'
import { Multer } from 'multer'
import { upload as gcsUpload } from 'gcs-resumable-upload'
import { File } from './interfaces/File'
import { Bucket, Storage } from '@google-cloud/storage'
import formatFiles from '../utils/formatFiles'
import { CloudActionResponse } from './interfaces/CloudActionResponse'
import * as path from 'path'
import { Readable } from 'stream'

// Includes configuration file into dist/ folder
import '../config/storageCreds.json'

const storageCredsPath = path.resolve(__dirname, '../config/storageCreds.json')

@Injectable()
export class StorageService {
	private bucket: Bucket
	constructor() {
		this.bucket = new Storage({
			keyFilename: storageCredsPath
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

	async get(filename: string): Promise<File> {
		const [file] = await this.bucket.file(filename).get()
		return formatFiles([file])[0]
	}

	async find(filename: string): Promise<File[]> {
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
		return await this.move(filename, name)
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

	async upload(file: Multer.File): Promise<CloudActionResponse> {
		return await this.wrapCloudAction(async () => {
			const readable = Readable.from(file.buffer.toString())
			
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			//@ts-ignore
			readable.pipe(gcsUpload({
				authConfig: { keyFilename: storageCredsPath },
				file: file.originalname,
				bucket: this.bucket.name
			}))
			.on('progress', (data: any) => console.log('progress', data))
			.on('finish', () => console.log('finished'))
			.on('error', (data: any) => console.error('error', data))
		})
	}

	async download(filename: string): Promise<CloudActionResponse> {
		return await this.wrapCloudAction(async () => {
			const [file] = await this.bucket.file(filename).get()
			const downloadURL = formatFiles([file])[0].downloadURL
			return { message: downloadURL }
		})
	}
}
