'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Dynamically import Firebase to avoid SSR issues
let getAuth: any
let signInWithPopup: any
let GoogleAuthProvider: any
let firebaseSignOut: any
let onAuthStateChanged: any
let initializeApp: any
let getApps: any
let setPersistence: any
let browserLocalPersistence: any
let indexedDBLocalPersistence: any

// Initialize on client only
let app: any = null
let auth: any = null

// GPU Drip Firebase config - reads from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC_v3LKhQbN3t5DqLJQZFcjK9NbBgk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gpudrip.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gpudrip",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gpudrip.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "43585918685",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:43585918685:web:48a3eb4347d4909326ad34",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-CZQTV5M057"
}

async function initFirebase() {
  if (typeof window === 'undefined') return null
  if (auth) return auth
  
  const firebase = await import('firebase/app')
  const firebaseAuth = await import('firebase/auth')
  
  getAuth = firebaseAuth.getAuth
  signInWithPopup = firebaseAuth.signInWithPopup
  GoogleAuthProvider = firebaseAuth.GoogleAuthProvider
  firebaseSignOut = firebaseAuth.signOut
  onAuthStateChanged = firebaseAuth.onAuthStateChanged
  initializeApp = firebase.initializeApp
  getApps = firebase.getApps
  setPersistence = firebaseAuth.setPersistence
  browserLocalPersistence = firebaseAuth.browserLocalPersistence
  indexedDBLocalPersistence = firebaseAuth.indexedDBLocalPersistence
  
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  auth = getAuth(app)
  
  // Set persistence (indexedDB for mobile, localStorage for desktop)
  const persistence = window.matchMedia('(pointer: coarse)').matches 
    ? indexedDBLocalPersistence 
    : browserLocalPersistence
  
  try {
    await setPersistence(auth, persistence)
    console.log('[Auth] Persistence set')
  } catch (err) {
    console.error('[Auth] Persistence error:', err)
  }
  
  return auth
}

interface AuthContextType {
  user: any
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let unsubscribe: any = null

    async function setupAuth() {
      const authInstance = await initFirebase()
      if (!authInstance) {
        setLoading(false)
        return
      }

      unsubscribe = onAuthStateChanged(authInstance, (user: any) => {
        console.log('[Auth] Auth state:', user ? `User: ${user.email}` : 'No user')
        setUser(user)
        setLoading(false)
      }, (err: any) => {
        console.error('[Auth] Auth state error:', err)
        setError(err.message)
        setLoading(false)
      })
    }

    setupAuth()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    console.log('[Auth] Starting Google sign-in...')
    try {
      const authInstance = await initFirebase()
      if (!authInstance) {
        console.error('[Auth] Firebase not initialized')
        setError('Firebase not initialized')
        return
      }

      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      // Force account selection to avoid auto-redirect issues
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      console.log('[Auth] Using popup flow...')
      const result = await signInWithPopup(authInstance, provider)
      console.log('[Auth] Sign-in successful:', result.user?.email)
      setError(null)
    } catch (err: any) {
      console.error('[Auth] Google sign-in error:', err.code, err.message)
      
      // Better error messages
      let errorMsg = err.message
      if (err.code === 'auth/popup-blocked') {
        errorMsg = 'Popup blocked. Please allow popups for this site.'
      } else if (err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Sign-in cancelled. Please try again.'
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Sign-in window closed. Please try again.'
      }
      
      setError(errorMsg)
      throw err
    }
  }

  const signOut = async () => {
    const authInstance = await initFirebase()
    if (!authInstance) return
    try {
      await firebaseSignOut(authInstance)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
