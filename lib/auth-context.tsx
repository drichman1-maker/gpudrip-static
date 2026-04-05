'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Dynamically import Firebase to avoid SSR issues
let getAuth: any
let signInWithPopup: any
let signInWithRedirect: any
let getRedirectResult: any
let GoogleAuthProvider: any
let firebaseSignOut: any
let onAuthStateChanged: any
let initializeApp: any
let getApps: any

// Initialize on client only
let app: any = null
let auth: any = null

// GPU Drip Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC2kJhWPQbx-ryA61hJL3Hn1eNFHrdnBgk",
  authDomain: "gpudrip.firebaseapp.com",
  projectId: "gpudrip",
  storageBucket: "gpudrip.firebasestorage.app",
  messagingSenderId: "43585918685",
  appId: "1:43585918685:web:48a3eb4347d4909326ad34",
  measurementId: "G-CZQTV5M057"
}

async function initFirebase() {
  if (typeof window === 'undefined') return null
  if (auth) return auth
  
  const firebase = await import('firebase/app')
  const firebaseAuth = await import('firebase/auth')
  
  getAuth = firebaseAuth.getAuth
  signInWithPopup = firebaseAuth.signInWithPopup
  signInWithRedirect = firebaseAuth.signInWithRedirect
  getRedirectResult = firebaseAuth.getRedirectResult
  GoogleAuthProvider = firebaseAuth.GoogleAuthProvider
  firebaseSignOut = firebaseAuth.signOut
  onAuthStateChanged = firebaseAuth.onAuthStateChanged
  initializeApp = firebase.initializeApp
  getApps = firebase.getApps
  
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }
  auth = getAuth(app)
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

  // Detect mobile devices
  const isMobile = () => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  useEffect(() => {
    let unsubscribe: any = null

    async function setupAuth() {
      const authInstance = await initFirebase()
      if (!authInstance) {
        setLoading(false)
        return
      }

      // Check for redirect result first
      try {
        const result = await getRedirectResult(authInstance)
        if (result?.user) {
          console.log('[Auth] Redirect sign-in success:', result.user.email)
          setError(null)
        }
      } catch (err: any) {
        console.error('[Auth] Redirect result error:', err)
        setError(err.message)
      }

      unsubscribe = onAuthStateChanged(authInstance, (user: any) => {
        setUser(user)
        setLoading(false)
      }, (err: any) => {
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
      console.log('[Auth] Firebase initialized, creating provider...')

      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')

      const mobile = isMobile()
      console.log('[Auth] Device is mobile:', mobile)
      
      if (mobile) {
        console.log('[Auth] Using redirect flow...')
        await signInWithRedirect(authInstance, provider)
      } else {
        console.log('[Auth] Using popup flow...')
        const result = await signInWithPopup(authInstance, provider)
        console.log('[Auth] Sign-in successful:', result.user?.email)
        setError(null)
      }
    } catch (err: any) {
      console.error('[Auth] Google sign-in error:', err.code, err.message)
      setError(err.message || 'Sign-in failed')
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
