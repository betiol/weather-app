import { auth } from '../config/firebase'

export class AuthService {
  static async verifyToken(idToken: string): Promise<{ uid: string } | null> {
    try {
      const decodedToken = await auth.verifyIdToken(idToken)
      return { uid: decodedToken.uid }
    } catch (error) {
      console.error('Token verification failed:', error)
      return null
    }
  }
} 