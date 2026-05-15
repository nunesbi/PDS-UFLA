import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Configuração Firebase (usando valores públicos para demo)
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyForDevelopment123456789",
  authDomain: "congressounificado-demo.firebaseapp.com",
  projectId: "congressounificado-demo",
  storageBucket: "congressounificado-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Serviços
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
