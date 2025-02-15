import Dexie, { type EntityTable } from 'dexie';

interface Store {
  id: number;
  name: string;
}
interface Product {
  id?: number;
  name: string;
  quantity: number;
  type: string;
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
  products: '++id, name, quantity, type, stores, checked, priority',
});

export type { Product };
export type { Store };
export { db };
