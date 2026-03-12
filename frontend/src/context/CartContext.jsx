import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i => i._id === action.item._id && i.size === action.item.size && i.color === action.item.color);
      if (exists) return state.map(i =>
        i._id === action.item._id && i.size === action.item.size && i.color === action.item.color
          ? { ...i, quantity: i.quantity + 1 } : i
      );
      return [...state, { ...action.item, quantity: 1 }];
    }
    case 'REMOVE': return state.filter((_, idx) => idx !== action.index);
    case 'UPDATE_QTY': return state.map((i, idx) => idx === action.index ? { ...i, quantity: action.qty } : i);
    case 'CLEAR': return [];
    default: return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const addToCart   = (item) => dispatch({ type: 'ADD', item });
  const removeItem  = (index) => dispatch({ type: 'REMOVE', index });
  const updateQty   = (index, qty) => dispatch({ type: 'UPDATE_QTY', index, qty });
  const clearCart   = () => dispatch({ type: 'CLEAR' });
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);