import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import { ProductTitle } from 'src/pages/Cart/styles';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE

      const storageCart = await AsyncStorage.getItem('@GoMarketPlace:cart');

      if (storageCart) {
        setProducts(JSON.parse(storageCart));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART

      const findProduct = products.find(p => {
        return p.id === product.id;
      });

      if (findProduct) {
        findProduct.quantity += 1;
        setProducts([...products]);
      } else {
        setProducts([...products, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART

      const allProducts = [...products];

      const productIndex = products.findIndex(p => {
        return p.id === id;
      });

      if (productIndex > -1) {
        allProducts[productIndex].quantity += 1;
        setProducts(allProducts);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const allProducts = [...products];

      const productIndex = products.findIndex(p => {
        return p.id === id;
      });

      if (productIndex > -1) {
        if (allProducts[productIndex].quantity === 1) {
          allProducts.splice(productIndex, 1);
        } else {
          allProducts[productIndex].quantity -= 1;
        }
        setProducts(allProducts);
      }

      await AsyncStorage.setItem(
        '@GoMarketPlace:cart',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
