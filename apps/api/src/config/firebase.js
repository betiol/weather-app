"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERS_REF = exports.db = void 0;
const app_1 = require("firebase-admin/app");
const database_1 = require("firebase-admin/database");
const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
};
// Initialize Firebase Admin SDK only once
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(firebaseConfig),
        databaseURL: firebaseConfig.databaseURL,
    });
}
exports.db = (0, database_1.getDatabase)();
exports.USERS_REF = 'users';
