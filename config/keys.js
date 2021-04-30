export const config = {
	BEHOST: process.env.NEXT_PUBLIC_BE_HOST,
	localStorageTokenId: 'gideonidokowebsitetoken',
	firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	commentsUpdateAccessKey: process.env.NEXT_PUBLIC_COMMENTS_UPDATE_ACCESS_KEY,
	contactPostAccessKey: process.env.NEXT_PUBLIC_CONTACT_POST_ACCESS_KEY,
	localStorageCommentAuthorId: 'gideonidokowebsitecommentauthor',
	numberOfPostsPerPage: 5
}