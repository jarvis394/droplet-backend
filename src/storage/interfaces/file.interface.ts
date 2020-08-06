export interface File {
	/** File name */
	filename: string

	/** Date the file was uploaded */
	timestamp: number

	/** File download link on Firebase Storage */
	downloadURL: string

	/** Shows if the file is starred by user */
	isStarred: boolean
}