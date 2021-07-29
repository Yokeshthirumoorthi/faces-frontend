import firebase from "firebase/app"
import "firebase/auth"

// apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
// authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
// databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
// projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
// storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
// messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
// appId: process.env.REACT_APP_FIREBASE_APP_ID
const app = firebase.initializeApp({
  apiKey: "AIzaSyBOxPHRYRB53_WqDjyootwrmrcZgOS6dHM",
  authDomain: "testocr-8ae02.firebaseapp.com",
  databaseURL: "https://testocr-8ae02.firebaseio.com",
  projectId: "testocr-8ae02",
  storageBucket: "testocr-8ae02.appspot.com",
  messagingSenderId: "754244373027",
  appId: "1:754244373027:web:f388633c0891f3b3b67f96"
})

export const auth = app.auth()
export default app
