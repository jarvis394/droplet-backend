import { Injectable } from '@nestjs/common'
import { File } from './interfaces/File'
import { Bucket, Storage } from '@google-cloud/storage'
import formatFiles from '../utils/formatFiles'
import { CloudActionResponse } from './interfaces/CloudActionResponse'
import * as path from 'path'
import { PassThrough } from 'stream'
import { BUCKET_NAME } from '../config/keys'
import * as streamProgress from 'progress-stream'

// Includes configuration file into dist/ folder
import '../config/storageCreds.json'

const storageCredsPath = path.resolve(__dirname, '../config/storageCreds.json')

@Injectable()
export class StorageService {
	private bucket: Bucket
	constructor() {
		this.bucket = new Storage({
			keyFilename: storageCredsPath,
		}).bucket(BUCKET_NAME)
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

	async upload(file: Express.Multer.File): Promise<CloudActionResponse> {
		return await this.wrapCloudAction(async () => {
			const bufferStream = new PassThrough()
			const cloudFile = this.bucket.file(file.originalname)
			const cloudStream = cloudFile.createWriteStream({
				metadata: {
					metadata: { isStarred: false },
				},
			})
			const uploadProgress = streamProgress({
				time: 100,
				length: file.size
			})

			// Write data to stream
			bufferStream.end(file.buffer)
			bufferStream.pipe(cloudStream).pipe(uploadProgress)

			return new Promise((resolve, reject) => {
				uploadProgress
					.on('progress', data => console.log(data))
					.on('finish', () => console.log('Upload progress finished'))
					.on('error', error => console.log(error))
				bufferStream.on('end', () => resolve({ filename: file.originalname, size: file.size }))
				bufferStream.on('error', error => reject({ error }))
			})
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
