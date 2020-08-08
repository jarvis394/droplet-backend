export interface File {
	/** File name */
	name: string

	/** Date the file was uploaded */
	uploadTimestamp: number
	
	/** Date the file was updated */
	updateTimestamp: number

	/** File download link on Firebase Storage */
	downloadURL: string

	/** Shows if the file is starred by user */
	isStarred: boolean

	/** File size */
	size: number

	/** File type */
	contentType: string

	/** Token to view the file */
	token: string
}