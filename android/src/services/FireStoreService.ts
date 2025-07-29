// D: \SipCallApp\android\src\services\FireStoreService.ts
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    where as firebaseWhere,
    WhereFilterOp,
} from 'firebase/firestore';

import { db } from "../firebase/firebaseConfig";



// Kiểu Contact
export type Contact = {
    id: string;
    name: string;
    phone: string;
    email?: string;
    company?: string;
    
};

// Kiểu CallHistory
export type CallHistory = {
    id: string;
    phone: string;
    name?: string;
    type: "incoming" | "outgoing" | "missed";
    calledAt: Date;
};

// Thêm contact mới
export const addContact = async (
    name: string,
    phone: string,
    email?: string,
    company?: string
): Promise<void> => {
    try {
        await addDoc(collection(db, "contacts"), {
            name,
            phone,
            email,
            company,
            
        });
    } catch (error) {
        console.error("Error adding contact:", error);
    }
};

// Lấy toàn bộ danh bạ
export const getContacts = async (): Promise<Contact[]> => {
    const snapshot = await getDocs(collection(db, "contacts"));
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name || "Không tên",
            phone: data.phone || "",
            email: data.email || "",
            company: data.company || "",
        };
    });
};

// Xóa contact theo ID
export const deleteContact = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, "contacts", id));
};

// Tìm contact theo số điện thoại
export const getContactByPhoneNumber = async (
    phone: string
): Promise<Contact | null> => {
    const q = query(collection(db, "contacts"), where("phone", "==", phone));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();

        return {
            id: docSnap.id,
            name: data.name || "Không tên",
            phone: data.phone || "",
            email: data.email || "",
            company: data.company || "",
        };
    } else {
        console.log("Không tìm thấy contact với số điện thoại:", phone);
        return null;
    }
};

// Cập nhật contact theo ID
export const updateContact = async (
    id: string,
    updates: Partial<Omit<Contact, "id">>
): Promise<void> => {
    await updateDoc(doc(db, "contacts", id), updates);
};

// Lưu lịch sử cuộc gọi
export const saveCallHistory = async (
    phone: string,
    name: string,
    type: "incoming" | "outgoing" | "missed"
): Promise<void> => {
    try {
        await addDoc(collection(db, "callHistory"), {
            phone,
            name,
            type,
            calledAt: new Date(),
        });
    } catch (error) {
        console.error("Error saving call history:", error);
    }
};

// Lấy lịch sử cuộc gọi (mới nhất đến cũ nhất)
export const getCallHistory = async (): Promise<CallHistory[]> => {
    const callHistoryQuery = query(
        collection(db, "callHistory"),
        orderBy("calledAt", "desc")
    );

    const snapshot = await getDocs(callHistoryQuery);
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            phone: data.phone || "",
            name: data.name || "",
            type: data.type || "incoming",
            calledAt: data.calledAt?.toDate?.() || new Date(),
        };
    });
};

// Xoá 1 cuộc gọi theo ID
export const deleteCallHistory = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, "callHistory", id));
        console.log(`Deleted call history with id ${id}`);
    } catch (error) {
        console.error("Error deleting call history:", error);
    }
};

function where(fieldPath: string, opStr: WhereFilterOp, value: any) {
    return firebaseWhere(fieldPath, opStr, value);
}

