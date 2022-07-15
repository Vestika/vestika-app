import * as firebaseApp from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyDEvvCWETjFTlb422dGgjGqRsVJzWJAwFk",
  authDomain: "fine-ns.firebaseapp.com",
  databaseURL: "https://fine-ns.firebaseio.com",
  projectId: "fine-ns",
  storageBucket: "fine-ns.appspot.com",
  messagingSenderId: "956429935700",
  appId: "1:956429935700:web:724336580534c0b88579c1",
  measurementId: "G-KZ589FBRF8",
};
firebaseApp.initializeApp(firebaseConfig);
firebaseApp.analytics();

// utils
export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const persistence = firebaseApp.auth.Auth.Persistence;

// collection references
export const usersCollection = db.collection("users");
// const postsCollection = db.collection("posts");
// const commentsCollection = db.collection("comments");
// const likesCollection = db.collection("likes");

// export utils/refs
export default { db, auth, usersCollection, persistence };
