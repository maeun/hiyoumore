import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig_qa_db = {
  apiKey: "AIzaSyApILQ4LiT0OlOUk7qcwFemHbAaxZ9i0VE",
  authDomain: "hiyoumore.firebaseapp.com",
  databaseURL: "https://hiyoumore-qa-db.firebaseio.com/",
  projectId: "hiyoumore",
  storageBucket: "hiyoumore.appspot.com",
  messagingSenderId: "639266560667",
  appId: "1:639266560667:web:e3db55797c60fbd21dc43e",
  measurementId: "G-W87CZP2KB2",
};

const qa_db_init = initializeApp(firebaseConfig_qa_db, "qa_db_init");
const qa_db = getDatabase(qa_db_init);

const firebaseConfig_sign_up_db = {
  apiKey: "AIzaSyApILQ4LiT0OlOUk7qcwFemHbAaxZ9i0VE",
  authDomain: "hiyoumore.firebaseapp.com",
  databaseURL: "https://hiyoumore-sign-up-db.firebaseio.com/",
  projectId: "hiyoumore",
  storageBucket: "hiyoumore.appspot.com",
  messagingSenderId: "639266560667",
  appId: "1:639266560667:web:e3db55797c60fbd21dc43e",
  measurementId: "G-W87CZP2KB2",
};

const sign_up_db_init = initializeApp(
  firebaseConfig_sign_up_db,
  "sign_up_db_init"
);
const sign_up_db = getDatabase(sign_up_db_init);

const firebaseConfig_log_in_out_db = {
  apiKey: "AIzaSyApILQ4LiT0OlOUk7qcwFemHbAaxZ9i0VE",
  authDomain: "hiyoumore.firebaseapp.com",
  databaseURL: "https://hiyoumore-log-in-out-db.firebaseio.com/",
  projectId: "hiyoumore",
  storageBucket: "hiyoumore.appspot.com",
  messagingSenderId: "639266560667",
  appId: "1:639266560667:web:e3db55797c60fbd21dc43e",
  measurementId: "G-W87CZP2KB2",
};

const log_in_out_db_init = initializeApp(
  firebaseConfig_log_in_out_db,
  "log_in_out_db_init"
);
const log_in_out_db = getDatabase(log_in_out_db_init);

export { qa_db, sign_up_db, log_in_out_db };
