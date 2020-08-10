import { File as CloudFile } from '@google-cloud/storage'
import { File } from '../storage/interfaces/File'

const formatFiles = (files: CloudFile[]): File[] => {
	return files.map(
		(file): File => {
			const metadata = file?.metadata
			if (file)
				return {
					name: metadata.name,
					uploadTimestamp: metadata.timeCreated,
					updateTimestamp: metadata.updated,
					downloadURL:
						'https://storage.cloud.google.com/' +
						file.bucket.name +
						'/' +
						encodeURIComponent(metadata.name),
					isStarred: metadata.metadata?.isStarred === 'true',
					size: metadata.size,
					contentType: metadata.contentType,
				}
			else return null
		}
	)
}

export default formatFiles
