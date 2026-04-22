import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Smartphone, IndianRupee } from 'lucide-react';
import { allCatalogPhones, fallbackPhoneImage, type CatalogPhone } from '../data/phoneCatalog';

const Cart: React.FC = () => {
  const [savedIds, setSavedIds] = useState<number[]>(() => {
    const raw = localStorage.getItem('savedPhones');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('savedPhones', JSON.stringify(savedIds));
  }, [savedIds]);

  const savedPhones = useMemo(
    () => savedIds
      .map((id) => allCatalogPhones.find((phone) => phone.id === id))
      .filter(Boolean) as CatalogPhone[],
    [savedIds]
  );

  const removePhone = (phoneId: number) => {
    setSavedIds((current) => current.filter((id) => id !== phoneId));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setSavedIds([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
            <ShoppingCart className="text-blue-600" size={36} /> My Cart
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Your saved phones and items for quick reference.</p>
        </div>
        {savedPhones.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors"
          >
            <Trash2 size={18} /> Clear Cart
          </button>
        )}
      </div>

      {savedPhones.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="text-gray-300" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            You haven't saved any phones yet. Browse our catalog and save your favorite devices to compare them later.
          </p>
          <Link
            to="/phones"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all"
          >
            <Smartphone size={20} /> Browse Phones
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPhones.map((phone) => (
            <div key={phone.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
              <Link to={`/phones/${phone.id}`} className="relative h-48 bg-gray-50 flex items-center justify-center p-6">
                <img
                  src={phone.image}
                  alt={phone.name}
                  className="h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = fallbackPhoneImage;
                  }}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                  {phone.brand}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <Link to={`/phones/${phone.id}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {phone.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 text-gray-600 font-medium mb-4">
                  <IndianRupee size={16} className="text-gray-400" />
                  <span className="text-lg text-gray-900">{phone.price.toLocaleString()}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50 flex gap-2">
                  <Link
                    to={`/phones/${phone.id}`}
                    className="flex-1 flex items-center justify-center py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-colors"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => removePhone(phone.id)}
                    className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;