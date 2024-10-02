import { useEffect, useRef, useState } from 'react';
import './App.css';
import { toast, Toaster } from 'react-hot-toast';

import img1 from '../src/assets/2png.png';
import img2 from '../src/assets/seller.jfif';
import img3 from '../src/assets/img18.jpg';
import img4 from '../src/assets/img3.png';
import img5 from '../src/assets/3png.png';
import img6 from '../src/assets/img6.png';
import img7 from '../src/assets/img7.jpg';
import img8 from '../src/assets/img8.jfif';
import img9 from '../src/assets/img9.jfif';
import img10 from '../src/assets/img10.jpg';


const productData = [
  { id: 1, name: 'Ahemise with red hat', price: 45, description: 'A stylish red hat.', category: 'Fashion', seller: 'Sarah Welson', sellerImage: img2, image: img4 },
  { id: 2, name: 'Shemise with red hat', price: 30, description: 'A comfortable shemise.', category: 'Fashion', seller: 'Maria Johan', sellerImage: img2, image: img5 },
  { id: 3, name: 'Rhemise with red hat', price: 30, description: 'A casual rhemise.', category: 'Casual Wear', seller: 'Linda Walker', sellerImage: img2, image: img10 },
  { id: 4, name: 'Chemise with red hat', price: 30, description: 'A classic chemise.', category: 'Formal Wear', seller: 'Sana Kocovali', sellerImage: img2, image: img5 },
  { id: 5, name: 'Plouver Ketan Chemise', price: 60, description: 'Elegant and comfortable.', category: 'Winter Wear', seller: 'Rihan Weashgton', sellerImage: img2, image: img1 },
  { id: 6, name: 'Crop Top Cotton', price: 85, description: 'Soft cotton crop top.', category: 'Winter Wear', seller: 'Rihana Weashgton', sellerImage: img2, image: img1 },
  { id: 7, name: 'Silk Summer Dress', price: 90, description: 'Lightweight silk dress for summer.', category: 'Summer Wear', seller: 'Emma Brown', sellerImage: img2, image: img3 },
  { id: 8, name: 'Denim Jacket', price: 120, description: 'Classic denim jacket.', category: 'Casual Wear', seller: 'Jack Oliver', sellerImage: img2, image: img7 },
  { id: 9, name: 'Leather Boots', price: 150, description: 'Stylish leather boots.', category: 'Footwear', seller: 'Sophia Lee', sellerImage: img2, image: img8 },
  { id: 10, name: 'Woolen Scarf', price: 25, description: 'Warm woolen scarf.', category: 'Accessories', seller: 'Olivia Martin', sellerImage: img2, image: img9 },
];

function App() {
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem('products');
    return storedProducts ? JSON.parse(storedProducts) : productData;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('A - Z');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  const itemsPerPage = 4;

  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);
  const categoryRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addNewProduct = (e) => {
    e.preventDefault();
    if (!imagePreview) {
      toast.error('Please upload an image.');
      return;
    }
    if (!nameRef.current || nameRef.current.value.trim() === '') {
      toast.error('Title is required.');
      return;
    }
    if (!descriptionRef.current || descriptionRef.current.value.trim() === '') {
      toast.error('Description is required.');
      return;
    }


    if (!priceRef.current || priceRef.current.value.trim() === '') {
      toast.error('Price is required.');
      return;
    }


    if (!categoryRef.current || categoryRef.current.value === '') {
      toast.error('Category is required.');
      return;
    }


    const newProduct = {
      id: products.length + 1,
      name: nameRef.current.value,
      price: parseFloat(priceRef.current.value),
      description: descriptionRef.current.value,
      category: categoryRef.current.value,
      seller: 'Mohamed',
      sellerImage: img2,
      image: imagePreview,
    };

    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, newProduct];
      localStorage.setItem('products', JSON.stringify(updatedProducts));

      toast.success('Product added successfully!');
      return updatedProducts;
    });

    nameRef.current.value = '';
    priceRef.current.value = '';
    descriptionRef.current.value = '';
    categoryRef.current.value = '';
    setImagePreview(null);

    setIsUpdateFormVisible(false);
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === '' || product.category === filterCategory)
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'A - Z':
          return a.name.localeCompare(b.name);
        case 'Z - A':
          return b.name.localeCompare(a.name);
        case 'Price: Low to High':
          return a.price - b.price;
        case 'Price: High to Low':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`px-3 py-1  mx-1 ${currentPage === i ? ' border border-[#DBF9A3]' : 'bg-white text-gray-700'
            } hover:bg-blue-100`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <>
      <Toaster />
      <div className="page mt-20 w-5/6 h-2/3 mx-auto">
        <div className={`update-form ${isUpdateFormVisible ? 'flex' : 'hidden'} absolute justify-center items-center z-10 inset-0 bg-black`}>
          <div className="flex w-2/5 relative mx-auto justify-center items-center bg-gray-900">
            <form onSubmit={addNewProduct} className='w-full'>
              <div className="bg-white relative px-9 w-full p-6 rounded-sm shadow-md">
                <div className="close absolute top-4 right-4 cursor-pointer" onClick={() => setIsUpdateFormVisible(false)}>
                  <i className="fa-solid fa-xmark text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold mb-4">Sell an item</h2>
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2">Upload photos</label>
                  <div className="border-2 border-gray-300 rounded-sm h-28 flex justify-center items-center mb-2">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                    ) : (
                      <label className="cursor-pointer">
                        <div className="px-4 py-2 text-sm font-medium border border-[#DBF9A3] rounded">
                          Upload photo
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          accept="image/*"

                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2">Title</label>
                  <input type="text" ref={nameRef} className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2">Describe your item</label>
                  <textarea ref={descriptionRef} className="w-full h-28 resize-none text-sm border border-gray-300 rounded px-3 py-2" />
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2">Category</label>
                  <select ref={categoryRef} className="w-full border border-gray-300 rounded px-3 py-2">
                    <option value="">Select</option>
                    <option value="Winter Wear">Winter Wear</option>
                    <option value="Casual Wear">Casual Wear</option>
                    <option value="Sports Wear">Sports Wear</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium mb-2">Item price</label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <span className="px-3">£</span>
                    <input ref={priceRef} type="number" min="0" step="0.01" className="w-full flex justify-between px-3 py-2 border-l" placeholder="0.00" />
                  </div>
                </div>

                <button type='submit' className="w-full bg-[#D9F99D] font-semibold py-2 rounded hover:bg-[#bbda81] transition">
                  Upload item
                </button>
              </div>
            </form>     </div>
        </div>

        <div className="first w-full md:flex justify-between">
          <div className="search lg:w-1/3 md:w-1/2 w-full">
            <div className="flex justify-center items-center border border-gray-300 rounded-sm px-4 py-2 w-full">
              <input
                type="text"
                placeholder="Search by name or category"
                className="outline-none w-full text-gray-600 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <div className="sort-sell md:mt-0 mt-3 lg:w-1/2  md:w-1/2 w-full">
            <div className="flex  md:justify-normal justify-between items-center space-x-4">
              <div className="sort md:ms-auto ms-0 justify-center flex items-center gap-2">
                <p className="text-sm font-medium w-1/3" >Sort by</p>
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>A - Z</option>
                  <option>Z - A</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
              <div className="sort md:ms-auto ms-0 justify-center flex items-center gap-2">
                <p className="text-sm font-medium">Category</p>
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Casual Wear">Casual Wear</option>
                  <option value="Formal Wear">Formal Wear</option>
                  <option value="Winter Wear">Winter Wear</option>
                  <option value="Summer Wear">Summer Wear</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <button onClick={() => setIsUpdateFormVisible(true)} className="flex items-center justify-center gap-2 text-sm hover:bg-[#cbff6c] bg-[#D9F99D] font-sans py-2 px-5 rounded-sm">
                <i className="sell-item fa-solid fa-plus"></i>
                Sell item
              </button>
            </div>
          </div>
        </div>

        <div className="second mt-9 products w-full h-fit gap-5 grid lg:grid-cols-4 md:grid-cols-2">
          {displayedProducts.map((product) => (
            <div className="product-card " key={product.id}>
              <div className="product-img h-72 bg-slate-400 rounded-md overflow-hidden">
                <img className="rounded-md w-full h-full" src={product.image} alt="" />
              </div>
              <div className="product-name-price-heart mt-2 flex justify-between">
                <div className="name-price">
                  <p className="lg:text-xs text-lg text-gray-600 font-medium">{product.name}</p>
                  <p className="font-medium lg:text-base text-lg">£{product.price.toFixed(2)}</p>
                </div>
                <div className="heart border flex justify-center items-center w-9 h-9 rounded-md"><i className="fa-regular hover:text-red-600 cursor-pointer fa-heart"></i></div>
              </div>
              <div className="desc">
                <p className="lg:text-xs text-lg text-gray-600 font-medium">{product.description}</p>
              </div>
              <div className="seller-category flex justify-between items-center ">
                <div className="seller flex items-center gap-2 mt-2">
                  <img className="lg:w-7 lg:h-7 w-11 h-11 rounded-full" src={product.sellerImage} alt="Seller" />
                  <p className="lg:text-xs text-base text-gray-600 font-medium">{product.seller}</p>
                </div>
                <div className="category">
                  <p className='lg:text-xs  text-lg font-medium'>{product.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination mt-11 flex justify-between items-center gap-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium hover:bg-gray-200 transition ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
          >
            <i className="fa-solid fa-arrow-left me-1"></i> Previous
          </button>
          <div className="flex gap-3 space-x-1">{renderPageNumbers()}</div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium hover:bg-gray-200 transition ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-black'}`}
          >
            Next <i className="ms-1 fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
