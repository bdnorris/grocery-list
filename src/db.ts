import Dexie, { type EntityTable } from 'dexie';

interface Product {
  id?: number;
  name: string;
  quantity: number;
  type: string;
  store: string;
  checked: boolean;
  importance: number;
}

const db = new Dexie('GroceryList') as Dexie & {
  products: EntityTable<
    Product,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  products: '++id, name, quantity, type, store, checked, importance',
});

export type { Product };
export { db };
