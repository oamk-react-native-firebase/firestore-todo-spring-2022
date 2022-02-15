import firebase from 'firebase/compat';

const firebaseConfig = ({
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
});

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
export { firebase };
export const TODOS_COLLECTION = 'todos';