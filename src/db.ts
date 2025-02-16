import Dexie, { type EntityTable } from 'dexie';
import dexieCloud from "dexie-cloud-addon";

interface Store {
  id: number;
  name: string;
}
interface Product {
  id?: number;
  name: string;
  quantity: number;
  stores: Array<Store>;
  checked: boolean;
  priority: number;
}

const db = new Dexie('GroceryList') as Dexie & {
  products: EntityTable<
    Product,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  products: '@id, name, quantity, stores, checked, priority',
});

// Connect your dexie-cloud database:
db.cloud.configure({
  databaseUrl: import.meta.env.VITE_DEXIEDB_URL,
  requireAuth: true // optional
});

export type { Product };
export type { Store };
export { db };
