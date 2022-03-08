import { Config } from '../interfaces/config.interface';

export const config: Config = {
    BEHOST: process.env.NEXT_PUBLIC_BE_HOST as string,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL as string,
    firebaseApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
    firebaseAuthDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
    firebaseProjectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    firebaseStorageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    firebaseMessagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
    firebaseAppId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
    commentsUpdateAccessKey: process.env.NEXT_PUBLIC_COMMENTS_UPDATE_ACCESS_KEY as string,
    contactPostAccessKey: process.env.NEXT_PUBLIC_CONTACT_POST_ACCESS_KEY as string,
    localStorageCommentAuthorId: 'gideonidokowebsitecommentauthor',
    numberOfPostsPerPage: 5,
    reduxStorePersistenceKey: process.env.NEXT_PUBLIC_REDUX_PERSISTENCE_KEY as string,
    reduxStoreSecretKey: process.env.NEXT_PUBLIC_REDUX_SECRET_KEY as string,
    noAuthKey: process.env.NEXT_PUBLIC_NO_AUTH_KEY as string,
};
