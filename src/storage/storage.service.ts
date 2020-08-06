import { Injectable } from '@nestjs/common'
import { File } from './interfaces/file.interface'
import admin, { ServiceAccount } from 'firebase-admin'
import { Bucket } from '@google-cloud/storage'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const storageCreds = require('../config/storageCreds.json')

@Injectable()
export class StorageService {
    private bucket: Bucket
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(storageCreds as ServiceAccount),
            storageBucket: 'my-droplet.appspot.com',
        })
        this.bucket = admin.storage().bucket()
    }

    async findOne(filename: string): Promise<string> {
        return filename
    }

    async findAll(): Promise<File[]> {
		const data = await this.bucket.getFiles()
		return data.map(entry => entry[0])
    }
}
