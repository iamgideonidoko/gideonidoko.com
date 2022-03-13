export interface Config {
    BEHOST: string;
    baseUrl: string;
    firebaseApiKey: string;
    firebaseAuthDomain: string;
    firebaseProjectId: string;
    firebaseStorageBucket: string;
    firebaseMessagingSenderId: string;
    firebaseAppId: string;
    commentsUpdateAccessKey: string;
    contactPostAccessKey: string;
    localStorageCommentAuthorId: string;
    numberOfPostsPerPage: number;
    reduxStorePersistenceKey: string;
    reduxStoreSecretKey: string;
    noAuthKey: string;
}
