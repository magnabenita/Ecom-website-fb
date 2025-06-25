import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // ✅ Firebase user

  const handleSellClick = () => {
    if (!currentUser) {
      alert('Please log in to sell your product.');
      navigate('/login');
    } else {
      navigate('/addproduct');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left: Text Content */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-5xl font-extrabold leading-tight">
            Discover, Shop, and <span className="text-purple-500">Sell</span> with <span className="text-purple-400">M</span>
          </h1>
          <p className="text-lg text-gray-300">
            Explore top-quality electronics, fashion, books, and more — all in one place. Hassle-free. Secure. Stylish.
          </p>
          <div className="flex justify-center md:justify-start gap-4 pt-2">
            <button
              onClick={() => navigate('/products')}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded shadow-md transition"
            >
              Shop Now
            </button>
            <button
              onClick={handleSellClick}
              className="border border-purple-500 hover:border-purple-600 px-5 py-2 rounded shadow-md transition"
            >
              Sell Your Product
            </button>
          </div>
        </div>

        {/* Right: Image */}
        <div className="flex justify-center">
          <img
            src="https://tse2.mm.bing.net/th?id=OIP.pWK864u7nu0sh0MR78vBMgHaE7&pid=Api&P=0&h=180"
            alt="E-commerce Illustration"
            className="rounded-xl shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>

      {/* Footer Line */}
      <div className="absolute bottom-6 w-full text-center text-purple-400 italic text-sm">
        "Your one-stop shop for everything awesome!"
      </div>
    </div>
  );
};

export default Home;
