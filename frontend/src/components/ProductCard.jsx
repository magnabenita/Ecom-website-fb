import React from 'react';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, isAdmin }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // ✅ Add to Cart — copy createdBy to addedBy
  const addToCart = async (product) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const ref = doc(db, 'users', currentUser.uid, 'cart', product.id);
      await setDoc(ref, {
        ...product,
        quantity: 1,
        addedBy: product.createdBy || null,
      });
      alert('✅ Added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart.');
    }
  };

  // ✅ Add to Wishlist (no changes needed)
  const addToWishlist = async (product) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const ref = doc(db, 'users', currentUser.uid, 'wishlist', product.id);
      await setDoc(ref, product);
      alert('❤️ Added to wishlist!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to wishlist.');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this product?');
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'products', product.id));
      alert('Deleted!');
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Store addedBy in Buy Now as well
  const buyNow = async (product) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Add addedBy before saving to localStorage
    const productWithOwner = {
      ...product,
      addedBy: product.createdBy || null,
      quantity: 1,
    };

    localStorage.setItem('checkoutItem', JSON.stringify(productWithOwner));
    navigate('/checkout?single=true');
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded mb-3"
      />
      <h3 className="text-xl font-bold">{product.name}</h3>
      <p>{product.description}</p>
      <p className="text-purple-400 mt-1 font-semibold">₹{product.price}</p>
      <p className="text-sm italic text-gray-400">Category: {product.category}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {isAdmin && (
          <>
            <button
              onClick={() => navigate(`/edit/${product.id}`)}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded"
            >
              Delete
            </button>
          </>
        )}
        <button
          onClick={() => addToCart(product)}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded"
        >
          Add to Cart
        </button>
        <button
          onClick={() => addToWishlist(product)}
          className="px-3 py-1 bg-pink-500 hover:bg-pink-600 rounded"
        >
          ❤️ Wishlist
        </button>
        <button
          onClick={() => buyNow(product)}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
        >
          🛍️ Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
