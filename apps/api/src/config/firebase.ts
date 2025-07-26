import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

if (!getApps().length) {
  initializeApp({
    credential: cert(firebaseConfig),
    databaseURL: firebaseConfig.databaseURL,
  });
}

export const db = getDatabase();
export const USERS_REF = 'users'; 