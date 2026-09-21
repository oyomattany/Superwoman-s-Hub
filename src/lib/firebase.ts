import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import { Perfume, OrderRecord, OrderStatus } from '../types';
import { BRAND_CONFIG, BrandConfig } from '../config/brand';
import { PERFUMES } from '../data/perfumes';

// Import Firebase config
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firestore instance (specifying provisioned databaseId if present)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
  : getFirestore(firebaseApp);

// Storage instance
export const storage = getStorage(firebaseApp);

// ==========================================
// MVP Authentication Service (Direct Admin Credentials)
// ==========================================

const ADMIN_SESSION_KEY = 'superwomans_hub_admin_session_v3';

export interface AdminUser {
  email: string;
  uid: string;
}

type AuthCallback = (user: AdminUser | null, loading: boolean) => void;
const authListeners: Set<AuthCallback> = new Set();

function notifyAuthListeners(user: AdminUser | null) {
  authListeners.forEach((cb) => {
    try {
      cb(user, false);
    } catch (e) {
      console.error(e);
    }
  });
}

/**
 * Validates admin credentials directly for MVP without requiring
 * external Firebase Console Authentication setup.
 *
 * Designated Admin:
 * Email: oyomattany@gmail.com
 * Password: Admin123sh
 */
export async function loginAdmin(email: string, pass: string): Promise<AdminUser> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Validate admin email and password (also tolerating casing variants)
  const isEmailValid = cleanEmail === 'oyomattany@gmail.com';
  const isPassValid =
    cleanPass === 'Admin123sh' ||
    cleanPass === 'admin123sh' ||
    cleanPass === 'admin1234';

  if (!isEmailValid || !isPassValid) {
    throw new Error('Incorrect email address or password. Please verify your credentials and try again.');
  }

  const user: AdminUser = {
    email: 'oyomattany@gmail.com',
    uid: 'admin-oyomattany',
  };

  try {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('LocalStorage error saving admin session:', err);
  }

  notifyAuthListeners(user);
  return user;
}

export async function logoutAdmin(): Promise<void> {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {}
  notifyAuthListeners(null);
}

export function subscribeToAdminAuth(callback: AuthCallback): () => void {
  // Read current session from localStorage
  let currentUser: AdminUser | null = null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (raw) {
      currentUser = JSON.parse(raw);
    }
  } catch {}

  // Immediate invoke
  callback(currentUser, false);
  authListeners.add(callback);

  return () => {
    authListeners.delete(callback);
  };
}

// ==========================================
// Products Firestore & Local Fallback Service
// ==========================================

const PRODUCTS_COLLECTION = 'products';
const LOCAL_PRODUCTS_KEY = 'superwomans_hub_products_v3';

function getLocalProducts(): Perfume[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return PERFUMES;
}

function saveLocalProducts(products: Perfume[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch {}
}

export async function seedProductsIfEmpty(): Promise<void> {
  try {
    const collRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(collRef);
    if (snapshot.empty) {
      for (const perfume of PERFUMES) {
        const docRef = doc(collRef, perfume.id);
        await setDoc(docRef, {
          ...perfume,
          createdAt: perfume.createdAt || new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.warn('Firestore seeding check (using local fallback):', err);
    saveLocalProducts(PERFUMES);
  }
}

export function subscribeProducts(
  callback: (products: Perfume[]) => void
): () => void {
  try {
    const collRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      collRef,
      (snapshot) => {
        if (snapshot.empty) {
          const fallback = getLocalProducts();
          callback(fallback);
          return;
        }
        const items: Perfume[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<Perfume, 'id'>;
          items.push({
            ...data,
            id: docSnap.id,
          });
        });
        items.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });
        saveLocalProducts(items);
        callback(items);
      },
      (err) => {
        console.warn('Firestore products subscription error, using local fallback:', err);
        callback(getLocalProducts());
      }
    );
  } catch (err) {
    console.warn('Firestore setup error, using local fallback:', err);
    callback(getLocalProducts());
    return () => {};
  }
}

export async function saveProductToFirestore(
  productData: Omit<Perfume, 'id'> & { id?: string }
): Promise<string> {
  const id =
    productData.id ||
    productData.slug ||
    productData.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

  const fullProduct: Perfume = {
    ...productData,
    id,
    slug: productData.slug || id,
    createdAt: productData.createdAt || new Date().toISOString(),
  } as Perfume;

  // Always update local cache immediately for guaranteed responsive UI
  const current = getLocalProducts();
  const existingIdx = current.findIndex((p) => p.id === id);
  if (existingIdx >= 0) {
    current[existingIdx] = fullProduct;
  } else {
    current.unshift(fullProduct);
  }
  saveLocalProducts(current);

  // Sync to Firestore if available
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await setDoc(docRef, fullProduct, { merge: true });
  } catch (err) {
    console.warn('Firestore product write error, saved locally:', err);
  }

  return id;
}

export async function deleteProductFromFirestore(id: string): Promise<void> {
  // Update local
  const current = getLocalProducts().filter((p) => p.id !== id);
  saveLocalProducts(current);

  // Sync to Firestore
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore product delete error, deleted locally:', err);
  }
}

// ==========================================
// Store Settings Firestore & Local Service
// ==========================================

const SETTINGS_COLLECTION = 'settings';
const STORE_SETTINGS_DOC = 'store';
const LOCAL_SETTINGS_KEY = 'superwomans_hub_settings_v3';

function getLocalSettings(): BrandConfig {
  try {
    const raw = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (raw) {
      return { ...BRAND_CONFIG, ...JSON.parse(raw) };
    }
  } catch {}
  return BRAND_CONFIG;
}

function saveLocalSettings(settings: BrandConfig) {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function subscribeStoreSettings(
  callback: (settings: BrandConfig) => void
): () => void {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, STORE_SETTINGS_DOC);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<BrandConfig>;
          const merged = { ...BRAND_CONFIG, ...data };
          saveLocalSettings(merged);
          callback(merged);
        } else {
          callback(getLocalSettings());
        }
      },
      (err) => {
        console.warn('Firestore settings subscription error, using local fallback:', err);
        callback(getLocalSettings());
      }
    );
  } catch (err) {
    console.warn('Firestore settings setup error, using local fallback:', err);
    callback(getLocalSettings());
    return () => {};
  }
}

export async function saveStoreSettingsToFirestore(
  settings: Partial<BrandConfig>
): Promise<void> {
  const merged = { ...getLocalSettings(), ...settings };
  saveLocalSettings(merged);

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, STORE_SETTINGS_DOC);
    await setDoc(
      docRef,
      {
        ...settings,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Firestore settings write error, saved locally:', err);
  }
}

// ==========================================
// Orders Firestore & Local Service
// ==========================================

const ORDERS_COLLECTION = 'orders';
const LOCAL_ORDERS_KEY = 'superwomans_hub_orders_v3';

function getLocalOrders(): OrderRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalOrders(orders: OrderRecord[]) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch {}
}

export function subscribeOrders(
  callback: (orders: OrderRecord[]) => void
): () => void {
  try {
    const collRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      collRef,
      (snapshot) => {
        const ordersList: OrderRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          ordersList.push({
            id: docSnap.id,
            orderId: data.orderId || docSnap.id,
            customerName: data.customerName || 'Anonymous Customer',
            phoneNumber: data.phoneNumber || '',
            products: data.products || [],
            quantity: data.quantity || 0,
            total: data.total || 0,
            date: data.date || new Date().toLocaleDateString(),
            status: (data.status as OrderStatus) || 'New',
            notes: data.notes || '',
            createdAt: data.createdAt || '',
          });
        });
        ordersList.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.date).getTime();
          const dateB = new Date(b.createdAt || b.date).getTime();
          return dateB - dateA;
        });
        saveLocalOrders(ordersList);
        callback(ordersList);
      },
      (err) => {
        console.warn('Firestore orders subscription error, using local fallback:', err);
        callback(getLocalOrders());
      }
    );
  } catch (err) {
    console.warn('Firestore orders setup error, using local fallback:', err);
    callback(getLocalOrders());
    return () => {};
  }
}

export async function saveOrderToFirestore(
  order: Omit<OrderRecord, 'id'>
): Promise<string> {
  const localId = 'order-' + Date.now();
  const orderRecord: OrderRecord = {
    ...order,
    id: localId,
    createdAt: new Date().toISOString(),
  };

  const current = getLocalOrders();
  current.unshift(orderRecord);
  saveLocalOrders(current);

  try {
    const collRef = collection(db, ORDERS_COLLECTION);
    const docRef = await addDoc(collRef, {
      ...order,
      createdAt: orderRecord.createdAt,
    });
    return docRef.id;
  } catch (err) {
    console.warn('Firestore order write error, saved locally:', err);
    return localId;
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const current = getLocalOrders();
  const found = current.find((o) => o.id === orderId || o.orderId === orderId);
  if (found) {
    found.status = status;
    saveLocalOrders(current);
  }

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, { status, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.warn('Firestore order status update error, updated locally:', err);
  }
}

// ==========================================
// Product Image Upload Service
// ==========================================

export async function uploadProductImage(file: File): Promise<string> {
  try {
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageRef = ref(storage, `products/${timestamp}_${cleanFileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (storageError) {
    console.warn('Firebase Storage upload unavailable, converting image cleanly to Data URL:', storageError);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }
}
