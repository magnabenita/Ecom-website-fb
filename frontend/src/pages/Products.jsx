import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const fetchUserRole = async () => {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsAdmin(userSnap.data().role === 'admin');
        }
      };
      fetchUserRole();
    }
  }, [currentUser]);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filteredResults = products.filter(p => {
      const matchesName = p.name.toLowerCase().includes(searchLower);
      const matchesCategory = category ? p.category === category : true;
      return matchesName && matchesCategory;
    });
    setFiltered(filteredResults);
  }, [search, category, products]);

  return (
    <div className="p-4 text-white min-h-screen bg-gray-900">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="px-3 py-2 rounded text-black w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-3 py-2 rounded text-black w-full md:w-1/3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center text-purple-400 mt-10">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-red-400 mt-10">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
