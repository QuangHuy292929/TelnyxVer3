import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// ✅ Định nghĩa kiểu Contact
export type Contact = {
    id: string;
    name: string;
    number: string;
};
const firebaseConfig = {
    apiKey: "AIzaSyDQeVwTcBCiJmf_QbbVhHnzLS7vUJ27tis",
    authDomain: "sipcallapp-fdb79.firebaseapp.com",
    projectId: "sipcallapp-fdb79",
    storageBucket: "sipcallapp-fdb79.firebasestorage.app",
    messagingSenderId: "159826001908",
    appId: "1:159826001908:web:7b1460e2dc38490a1743a1",
    measurementId: "G-12JVER47NK"
};
// ✅ Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Hàm lấy danh bạ
export const getContacts = async (): Promise<Contact[]> => {
    const snapshot = await getDocs(collection(db, "contacts"));
    const contacts: Contact[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || "Không tên",
            number: data.number || "",
        };
    });
    return contacts;
};

export { db };