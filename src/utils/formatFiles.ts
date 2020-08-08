import { File as CloudFile } from '@google-cloud/storage'
import { File } from '../storage/interfaces/File'

const formatFiles = (files: CloudFile[]): File[] => {
    return files.map(
        (file): File => {
            const metadata = file?.metadata
            const token = metadata?.metadata?.firebaseStorageDownloadTokens
            if (file)
                return {
                    name: metadata.name,
                    uploadTimestamp: metadata.timeCreated,
                    updateTimestamp: metadata.updated,
                    downloadURL:
                        'https://firebasestorage.googleapis.com/v0/b/' +
                        file.bucket.name +
                        '/o/' +
                        encodeURIComponent(metadata.name) +
                        '?alt=media&token=' +
                        token,
                    isStarred: metadata.metadata?.isStarred === 'true',
                    size: metadata.size,
                    contentType: metadata.contentType,
                    token,
                }
            else return null
        }
    )
}

export default formatFiles
