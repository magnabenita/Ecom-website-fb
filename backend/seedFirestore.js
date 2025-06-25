// seedFirestore.js
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json'); // 👈 Your Firebase service key

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const products = [ // Electronics
  {
    name: "Wireless Headphones",
    imageUrl: "https://content.api.news/v3/images/bin/700b74a70c2fb8fd410208ec3b09a355",
    category: "Electronics",
    description: "Noise-cancelling Bluetooth headphones",
    price: 2999
  },
  {
    name: "Smartwatch",
    imageUrl: "https://tse2.mm.bing.net/th?id=OIP.bPjE3IvBwrujueTJPYT9zAHaEK&pid=Api&P=0&h=180",
    category: "Electronics",
    description: "Tracks fitness & health",
    price: 2499
  },
  {
    name: "Power Bank 20000mAh",
    imageUrl: "https://m.media-amazon.com/images/I/71vFKBpKakL._AC_SL1500_.jpg",
    category: "Electronics",
    description: "Long-lasting portable charger",
    price: 1299
  },
  {
    name: "Bluetooth Speaker",
    imageUrl: "https://www.gannett-cdn.com/-mm-/cad2582cce719e874712c28c097825a418f0fbe5/c=263-0-4313-2288/local/-/media/2017/04/17/USATODAY/USATODAY/636280440039726449-P1022483.jpg?width=3200&height=1680&fit=crop",
    category: "Electronics",
    description: "High bass portable speaker",
    price: 1899
  },
  {
    name: "USB-C Hub",
    imageUrl: "https://www.dlink.com/se/sv/products/-/media/product-pages/dub/m530/dub_m530_a1_forgb.jpg",
    category: "Electronics",
    description: "Multiport expansion adapter",
    price: 999
  },

  // Clothing
  {
    name: "Men's T-Shirt",
    imageUrl: "https://i5.walmartimages.com/asr/518a2140-c759-4ab6-a3a1-45151f374d18.afbb3cb6be3cd93a39d8f056e423fb9b.jpeg",
    category: "Clothing",
    description: "Cotton round-neck casual tee",
    price: 599
  },
  {
    name: "Women's Kurti",
    imageUrl: "https://d2x02matzb08hy.cloudfront.net/img/project_photo/image/10219558/39722/large_Untitled_design__4_.jpg",
    category: "Clothing",
    description: "Printed straight kurti",
    price: 899
  },
  {
    name: "Hoodie Jacket",
    imageUrl: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/zip-up-hoodie-refresh-lead-1674060677.jpg?crop=0.502xw:1.00xh;0.250xw,0&resize=1200:*",
    category: "Clothing",
    description: "Warm fleece hoodie",
    price: 1499
  },
  {
    name: "Formal Shirt",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.lq1uTjRIgamlEp_lBfHNLAHaHa&pid=Api&P=0&h=180",
    category: "Clothing",
    description: "Slim fit cotton shirt",
    price: 799
  },
  {
    name: "Denim Jeans",
    imageUrl: "https://tse1.mm.bing.net/th?id=OIP.lImmM4CV-7V2cAkN8Qi3xQHaDe&pid=Api&P=0&h=180",
    category: "Clothing",
    description: "Stretchable slim-fit jeans",
    price: 1099
  },

  // Books
  {
    name: "The Alchemist",
    imageUrl: "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UL1500_.jpg",
    category: "Books",
    description: "A fable about following your dream",
    price: 399
  },
  {
    name: "Atomic Habits",
    imageUrl: "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UL1500_.jpg",
    category: "Books",
    description: "Habit-building and self improvement",
    price: 499
  },
  {
    name: "Rich Dad Poor Dad",
    imageUrl: "https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UL1500_.jpg",
    category: "Books",
    description: "Personal finance & mindset",
    price: 399
  },
  {
    name: "Wings of Fire",
    imageUrl: "https://wallpaper.dog/large/20579367.jpg",
    category: "Books",
    description: "APJ Abdul Kalam's autobiography",
    price: 299
  },
  {
    name: "1984 by George Orwell",
    imageUrl: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UL1500_.jpg",
    category: "Books",
    description: "Dystopian political fiction",
    price: 349
  }];

const seed = async () => {
  try {
    const batch = db.batch();
    const collectionRef = db.collection('products');

    products.forEach(product => {
      const docRef = collectionRef.doc(); // auto-generated ID
      batch.set(docRef, product);
    });

    await batch.commit();
    console.log('✅ Products added to Firestore');
  } catch (err) {
    console.error('❌ Error seeding Firestore:', err);
  }
};

seed();
