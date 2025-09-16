// Global variables
let allProducts = [];
let allOffers = [];
let filteredProducts = [];
let currentFilters = {
    type: [],
    color: [],
    price: [],
    branch: []
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products page if we're on it
    if (document.getElementById('productsGrid')) {
        loadProducts();
    }
    
    // Initialize offers page if we're on it
    if (document.getElementById('offersGrid')) {
        loadOffers();
    }
    
    // Initialize home page if we're on it
    if (document.getElementById('featuredProductsGrid')) {
        loadFeaturedProducts();
    }
    
    // Search functionality
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            openSearchModal();
        });
    }
    
    // Search input event listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const query = this.value.trim();
                if (query.length > 0) {
                    performSearch(query);
                } else {
                    showSearchSuggestions();
                }
            }, 300); // Debounce search
        });
        
        // Handle Enter key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query.length > 0) {
                    performSearch(query);
                }
            }
        });
    }
    
    // Login functionality
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Define admin credentials
    const adminCredentials = [
        { email: 'admin@salem.com', password: 'admin123' },
        { email: 'manager@salem.com', password: 'manager123' }
    ];
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            let authSuccessful = false;
            for (let cred of adminCredentials) {
                if (email === cred.email && password === cred.password) {
                    authSuccessful = true;
                    break;
                }
            }
            
            if (authSuccessful) {
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
                alert('Login successful! Redirecting to dashboard...');
                // window.location.href = 'dashboard.html';
            } else {
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
            }
        });
    }
});




     // API URL
     const API_URL = 'https://f9244004d8c8.ngrok-free.app/api/products';

     // Fetch products from API
     async function fetchProducts() {
         try {
             // Show loading spinner
             const productsGrid = document.getElementById('productsGrid');
             if (productsGrid) {
                 productsGrid.innerHTML = `
                     <div class="loading">
                         <div class="spinner"></div>
                     </div>
                 `;
             }
           
             // Fetch data from API with proper headers
             const response = await fetch(API_URL, {
                 method: 'GET',
                 mode: 'cors',
                 headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'ngrok-skip-browser-warning': 'true',
                     'Access-Control-Allow-Origin': '*'
                 }
             });
             
             console.log('Response status:', response.status);
             console.log('Response headers:', response.headers);
             
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             
             const data = await response.json();
             console.log('API Response:', data); // Debug log
             
             // Check if data exists - handle different response formats
             let productsData = [];
             if (data.success && data.data) {
                 productsData = data.data;
             } else if (Array.isArray(data)) {
                 productsData = data;
             } else if (data.products) {
                 productsData = data.products;
             } else {
                 throw new Error('No product data found in API response');
             }
             
             // Map API data to our product structure - ensuring ID compatibility
            let products = productsData.map(product => {
                // Ensure ID is properly handled as number from JSON
                const productId = parseInt(product.id);
                
                // Determine price information
                const hasDiscount = product.price_before && product.price_after && 
                                    parseFloat(product.price_before) > parseFloat(product.price_after);
                const discountPercent = hasDiscount ? 
                    Math.round((1 - parseFloat(product.price_after) / parseFloat(product.price_before)) * 100) : 0;
                
                // Format prices as EGP
                const formatPrice = (price) => {
                    if (!price) return '';
                    return `EGP ${parseFloat(price).toLocaleString('en-EG')}`;
                };
                
                
                const stockStatuses = ['in-stock', 'low-stock', 'out-of-stock'];
                const randomStockStatus = stockStatuses[Math.floor(Math.random() * stockStatuses.length)];
                const stockTexts = {
                    'in-stock': 'In Stock',
                    'low-stock': 'Low Stock',
                    'out-of-stock': 'Out of Stock'
                };
                
                // Construct image URLs - handle both string and array formats
                let imageUrls = [];
                if (product.images) {
                    if (Array.isArray(product.images)) {
                        imageUrls = product.images.map(img => {
                            // Handle different image path formats
                            if (img.startsWith('http')) {
                                return img;
                            } else if (img.startsWith('/')) {
                                return `https://f9244004d8c8.ngrok-free.app${img}`;
                            } else {
                                return `https://f9244004d8c8.ngrok-free.app/${img}`;
                            }
                        });
                    } else if (typeof product.images === 'string') {
                        const img = product.images;
                        if (img.startsWith('http')) {
                            imageUrls = [img];
                        } else if (img.startsWith('/')) {
                            imageUrls = [`https://f9244004d8c8.ngrok-free.app${img}`];
                        } else {
                            imageUrls = [`https://f9244004d8c8.ngrok-free.app/${img}`];
                        }
                    }
                }
                if (imageUrls.length === 0) {
                    imageUrls = ['https://placehold.co/600x800/000000/FFFFFF/png?text=No+Image+Available'];
                }
                
                return {
                    id: productId,
                    name: product.name || 'Unnamed Product',
                    type: product.type || 'Not specified',
                    price_after: formatPrice(product.price_after) || formatPrice(product.price_before) || 'Price on request',
                    price_before: hasDiscount ? formatPrice(product.price_before) : '',
                    description: product.description || 'No description available',
                    colors: Array.isArray(product.colors) ? product.colors : [],
                    images: imageUrls,
                    branch: product.branch ? product.branch.name : 'Not specified',
                    location: product.branch ? product.branch.location : 'Not specified',
                    phone: product.branch ? product.branch.phone : 'Not specified',
                    branchId: product.branch ? product.branch.id : null
                };
            });
             
             return products;
             
         } catch (error) {
             console.error('Error fetching products:', error);
             
             // Show error message with more details
             const productsGrid = document.getElementById('productsGrid');
             if (productsGrid) {
                 productsGrid.innerHTML = `
                     <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                         <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #666; margin-bottom: 1rem;"></i>
                         <h3>Error loading products</h3>
                         <p>Error: ${error.message}</p>
                         <p>Please check your internet connection and try again</p>
                         <button onclick="loadProducts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #d4af37; color: white; border: none; border-radius: 4px; cursor: pointer;">
                             Retry
                         </button>
                     </div>
                 `;
             }
             
             return [];
         }
     }

     // Render products in the grid
     function renderProducts(products) {
         const productsGrid = document.getElementById('productsGrid');
         
         if (products.length === 0) {
             productsGrid.innerHTML = `
                 <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                     <i class="fas fa-search" style="font-size: 3rem; color: var(--gray); margin-bottom: 1rem;"></i>
                     <h3>No products found</h3>
                     <p>Please check back later for new products</p>
                 </div>
             `;
             return;
         }
         
         productsGrid.innerHTML = products.map(product => `
             <div class="product-card">
                 <div class="product-img-container">
                     <img src="${product.images[0]}" alt="${product.name}" class="product-img">
                 </div>
                 <div class="product-info">
                     <h3 class="product-name">${product.name}</h3>
                     <div class="product-price">
                         <span class="current-price">${product.price_after}</span>
                         ${product.price_before ? `<span class="original-price">${product.price_before}</span>` : ''}
                     </div>
                     <div class="product-actions">
                         <button class="action-btn" onclick="openProductDetails(${product.id})">View Details</button>
                     </div>
                 </div>
             </div>
         `).join('');
     }

     // Load products function
     async function loadProducts() {
         const products = await fetchProducts();
         allProducts = products; // Cache products globally
         renderProducts(products);
     }

     // Remove duplicate DOMContentLoaded listener - using the one at the top

     // Product details functionality
     async function openProductDetails(productId) {
         // Use cached products instead of fetching again
         let products = allProducts;
         if (products.length === 0) {
             products = await fetchProducts();
             allProducts = products;
         }
         // Ensure productId is treated as number for comparison
         const product = products.find(p => p.id === parseInt(productId));
         
         if (!product) return;
         
         // Set main image
         document.getElementById('images').src = product.images[0];
         
         // Create thumbnails
         const thumbnailContainer = document.getElementById('thumbnailContainer');
         thumbnailContainer.innerHTML = '';
         
         product.images.forEach((image, index) => {
             const thumbnail = document.createElement('img');
             thumbnail.src = image;
             thumbnail.alt = `Thumbnail ${index + 1}`;
             thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
             thumbnail.addEventListener('click', function() {
                 document.getElementById('images').src = image;
                 document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                 this.classList.add('active');
             });
             thumbnailContainer.appendChild(thumbnail);
         });
         
         // Set product info
         document.getElementById('detailTitle').textContent = product.name;
         document.getElementById('detailCurrentPrice').textContent = product.price_after;
         
         const originalPriceEl = document.getElementById('detailOriginalPrice');
        
         
         if (product.price_before) {
             originalPriceEl.textContent = product.price_before;
         } else {
             originalPriceEl.textContent = '';
         }
         
         document.getElementById('detailDescription').textContent = product.description;
         document.getElementById('specType').textContent = product.type || 'Not specified';
         document.getElementById('specColors').textContent = product.colors.join(', ') || 'Not specified';
         document.getElementById('specBranch').textContent = product.branch;
         document.getElementById('specLocation').textContent = product.location;
         document.getElementById('specPhone').textContent = product.phone;
         
         // Show modal
         document.getElementById('productDetailsModal').style.display = 'block';
         document.body.style.overflow = 'hidden';
     }

     // Close product details
     function closeProductDetails() {
         document.getElementById('productDetailsModal').style.display = 'none';
         document.body.style.overflow = 'auto';
         // Re-render products to ensure they reappear
         if (allProducts.length > 0) {
             renderProducts(allProducts);
         }
     }

     // Close modal when clicking outside
     window.onclick = function(event) {
         const modal = document.getElementById('productDetailsModal');
         if (event.target === modal) {
             closeProductDetails();
         }
         const offerModal = document.getElementById('offerDetailsModal');
         if (event.target === offerModal) {
             closeOfferDetails();
         }
     };

     // OFFERS PAGE FUNCTIONALITY
     
     // API URL for offers
     const OFFERS_API_URL = 'https://f9244004d8c8.ngrok-free.app/api/products-with-offers';

     // Fetch offers from API
     async function fetchOffers() {
         try {
             // Show loading spinner
             const offersGrid = document.getElementById('offersGrid');
             if (offersGrid) {
                 offersGrid.innerHTML = `
                     <div class="loading">
                         <div class="spinner"></div>
                     </div>
                 `;
             }
           
             // Fetch data from API with proper headers
             const response = await fetch(OFFERS_API_URL, {
                 method: 'GET',
                 mode: 'cors',
                 headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json',
                     'ngrok-skip-browser-warning': 'true',
                     'Access-Control-Allow-Origin': '*'
                 }
             });
             
             console.log('Offers Response status:', response.status);
             
             if (!response.ok) {
                 throw new Error(`HTTP error! status: ${response.status}`);
             }
             
             const data = await response.json();
             console.log('Offers API Response:', data); // Debug log
             
             // Check if data exists - handle different response formats
             let offersData = [];
             if (data.success && data.data) {
                 offersData = data.data;
             } else if (Array.isArray(data)) {
                 offersData = data;
             } else if (data.products) {
                 offersData = data.products;
             } else {
                 throw new Error('No offers data found in API response');
             }
             
             // Map API data to our offer structure
             let offers = offersData.map(product => {
                 // Ensure ID is properly handled as number from JSON
                 const productId = parseInt(product.id);
                 
                 // Determine price information - offers should have discounts
                 const hasDiscount = product.price_before && product.price_after && 
                                     parseFloat(product.price_before) > parseFloat(product.price_after);
                 const discountPercent = hasDiscount ? 
                     Math.round((1 - parseFloat(product.price_after) / parseFloat(product.price_before)) * 100) : 0;
                 
                 // Format prices as EGP
                 const formatPrice = (price) => {
                     if (!price) return '';
                     return `EGP ${parseFloat(price).toLocaleString('en-EG')}`;
                 };
                 
                 // Construct image URLs - handle both string and array formats
                 let imageUrls = [];
                 if (product.images) {
                     if (Array.isArray(product.images)) {
                         imageUrls = product.images.map(img => {
                             // Handle different image path formats
                             if (img.startsWith('http')) {
                                 return img;
                             } else if (img.startsWith('/')) {
                                 return `https://f9244004d8c8.ngrok-free.app${img}`;
                             } else {
                                 return `https://f9244004d8c8.ngrok-free.app/${img}`;
                             }
                         });
                     } else if (typeof product.images === 'string') {
                         const img = product.images;
                         if (img.startsWith('http')) {
                             imageUrls = [img];
                         } else if (img.startsWith('/')) {
                             imageUrls = [`https://f9244004d8c8.ngrok-free.app${img}`];
                         } else {
                             imageUrls = [`https://f9244004d8c8.ngrok-free.app/${img}`];
                         }
                     }
                 }
                 if (imageUrls.length === 0) {
                     imageUrls = ['https://placehold.co/600x800/000000/FFFFFF/png?text=No+Image+Available'];
                 }
                 
                 return {
                     id: productId,
                     name: product.name || 'Unnamed Product',
                     type: product.type || 'Not specified',
                     price_after: formatPrice(product.price_after) || formatPrice(product.price_before) || 'Price on request',
                     price_before: hasDiscount ? formatPrice(product.price_before) : '',
                     discount: hasDiscount ? `${discountPercent}% OFF` : '',
                     description: product.description || 'No description available',
                     colors: Array.isArray(product.colors) ? product.colors : [],
                     images: imageUrls,
                     branch: product.branch ? product.branch.name : 'Not specified',
                     location: product.branch ? product.branch.location : 'Not specified',
                     phone: product.branch ? product.branch.phone : 'Not specified',
                     branchId: product.branch ? product.branch.id : null
                 };
             });
             
             return offers;
             
         } catch (error) {
             console.error('Error fetching offers:', error);
             
             // Show error message with more details
             const offersGrid = document.getElementById('offersGrid');
             if (offersGrid) {
                 offersGrid.innerHTML = `
                     <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                         <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #666; margin-bottom: 1rem;"></i>
                         <h3>Error loading offers</h3>
                         <p>Error: ${error.message}</p>
                         <p>Please check your internet connection and try again</p>
                         <button onclick="loadOffers()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #d4af37; color: white; border: none; border-radius: 4px; cursor: pointer;">
                             Retry
                         </button>
                     </div>
                 `;
             }
             
             return [];
         }
     }

     // Render offers in the grid
     function renderOffers(offers) {
         const offersGrid = document.getElementById('offersGrid');
         
         if (offers.length === 0) {
             offersGrid.innerHTML = `
                 <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                     <i class="fas fa-search" style="font-size: 3rem; color: #666; margin-bottom: 1rem;"></i>
                     <h3>No offers found</h3>
                     <p>Please check back later for new offers</p>
                 </div>
             `;
             return;
         }
         
         offersGrid.innerHTML = offers.map(offer => `
             <div class="product-card offer-card">
                 <div class="product-img-container">
                     <img src="${offer.images[0]}" alt="${offer.name}" class="product-img">
                     ${offer.discount ? `<div class="offer-badge">${offer.discount}</div>` : ''}
                 </div>
                 <div class="product-info">
                     <h3 class="product-name">${offer.name}</h3>
                     <div class="product-price">
                         <span class="current-price">${offer.price_after}</span>
                         ${offer.price_before ? `<span class="original-price">${offer.price_before}</span>` : ''}
                     </div>
                     <div class="product-actions">
                         <button class="action-btn" onclick="openOfferDetails(${offer.id})">View Details</button>
                     </div>
                 </div>
             </div>
         `).join('');
     }

     // Load offers function
     async function loadOffers() {
         const offers = await fetchOffers();
         allOffers = offers; // Cache offers globally
         renderOffers(offers);
     }

     // Offer details functionality
     async function openOfferDetails(offerId) {
         // Use cached offers instead of fetching again
         let offers = allOffers;
         if (offers.length === 0) {
             offers = await fetchOffers();
             allOffers = offers;
         }
         // Ensure offerId is treated as number for comparison
         const offer = offers.find(o => o.id === parseInt(offerId));
         
         if (!offer) return;
         
         // Set main image
         document.getElementById('offerMainImage').src = offer.images[0];
         
         // Create thumbnails
         const thumbnailContainer = document.getElementById('offerThumbnailContainer');
         thumbnailContainer.innerHTML = '';
         
         offer.images.forEach((image, index) => {
             const thumbnail = document.createElement('img');
             thumbnail.src = image;
             thumbnail.alt = `Thumbnail ${index + 1}`;
             thumbnail.className = 'thumbnail' + (index === 0 ? ' active' : '');
             thumbnail.addEventListener('click', function() {
                 document.getElementById('offerMainImage').src = image;
                 document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                 this.classList.add('active');
             });
             thumbnailContainer.appendChild(thumbnail);
         });
         
         // Set offer info
         document.getElementById('offerTitle').textContent = offer.name;
         document.getElementById('offerCurrentPrice').textContent = offer.price_after;
         
         const originalPriceEl = document.getElementById('offerOriginalPrice');
         const discountEl = document.getElementById('offerDiscount');
         
         if (offer.price_before) {
             originalPriceEl.textContent = offer.price_before;
             discountEl.textContent = offer.discount;
         } else {
             originalPriceEl.textContent = '';
             discountEl.textContent = '';
         }
         
         document.getElementById('offerDescription').textContent = offer.description;
         document.getElementById('offerSpecType').textContent = offer.type || 'Not specified';
         document.getElementById('offerSpecColors').textContent = offer.colors.join(', ') || 'Not specified';
         document.getElementById('offerSpecBranch').textContent = offer.branch;
         document.getElementById('offerSpecLocation').textContent = offer.location;
         document.getElementById('offerSpecPhone').textContent = offer.phone;
         
         // Show modal
         document.getElementById('offerDetailsModal').style.display = 'block';
         document.body.style.overflow = 'hidden';
     }

     // Close offer details
     function closeOfferDetails() {
         document.getElementById('offerDetailsModal').style.display = 'none';
         document.body.style.overflow = 'auto';
         // Re-render offers to ensure they reappear
         if (allOffers.length > 0) {
             renderOffers(allOffers);
         }
     }

     // HOME PAGE FUNCTIONALITY
     
     // Load featured products for homepage (limit to 3)
     async function loadFeaturedProducts() {
         try {
             // Use cached products if available
             let products = allProducts;
             if (products.length === 0) {
                 products = await fetchProducts();
                 allProducts = products;
             }
             const featuredProducts = products.slice(0, 3); // Get first 3 products
             renderFeaturedProducts(featuredProducts);
         } catch (error) {
             console.error('Error loading featured products:', error);
             const featuredGrid = document.getElementById('featuredProductsGrid');
             if (featuredGrid) {
                 featuredGrid.innerHTML = `
                     <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                         <p>Unable to load featured products</p>
                     </div>
                 `;
             }
         }
     }

     // Render featured products in the grid
     function renderFeaturedProducts(products) {
         const featuredGrid = document.getElementById('featuredProductsGrid');
         
         if (products.length === 0) {
             featuredGrid.innerHTML = `
                 <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                     <p>No featured products available</p>
                 </div>
             `;
             return;
         }
         
         featuredGrid.innerHTML = products.map(product => `
             <div class="product-card featured-card">
                 <div class="product-img-container">
                     <img src="${product.images[0]}" alt="${product.name}" class="product-img">
                 </div>
                 <div class="product-info">
                     <h3 class="product-name">${product.name}</h3>
                     <div class="product-price">
                         <span class="current-price">${product.price_after}</span>
                         ${product.price_before ? `<span class="original-price">${product.price_before}</span>` : ''}
                     </div>
                     <div class="product-actions">
                         <button class="action-btn" onclick="openProductDetails(${product.id})">View Details</button>
                     </div>
                 </div>
             </div>
         `).join('');
     }

     // Request modal functionality
     function openRequestModal() {
         document.getElementById('requestModal').style.display = 'block';
         document.body.style.overflow = 'hidden';
     }

     function closeRequestModal() {
         document.getElementById('requestModal').style.display = 'none';
         document.body.style.overflow = 'auto';
     }

     // Handle request form submission
     document.addEventListener('DOMContentLoaded', function() {
         const requestForm = document.getElementById('requestForm');
         if (requestForm) {
             requestForm.addEventListener('submit', function(e) {
                 e.preventDefault();
                 
                 // Get form data
                 const formData = new FormData(this);
                 const requestData = {
                     name: formData.get('name'),
                     email: formData.get('email'),
                     phone: formData.get('phone'),
                     type: formData.get('type'),
                     message: formData.get('message')
                 };
                 
                 // Here you would normally send the data to your server
                 console.log('Request submitted:', requestData);
                 
                 // Show success message
                 alert('Thank you for your request! We will contact you soon.');
                
                // Reset form and close modal
                this.reset();
                closeRequestModal();
            });
        }
    });

// SEARCH FUNCTIONALITY

// Global search state
let isSearching = false;

// Open search modal
function openSearchModal() {
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    if (searchModal && searchInput) {
        searchModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 200);
        showSearchSuggestions();
    }
}

// Close search modal
function closeSearchModal() {
    const searchModal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    if (searchModal) {
        searchModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    if (searchInput) {
        searchInput.value = '';
    }
}

// Show default suggestions
function showSearchSuggestions() {
    const container = document.getElementById('searchResults');
    if (!container) return;
    container.innerHTML = `
        <div class="search-suggestions">
            <h4>Popular Searches</h4>
            <div class="suggestion-tags">
                <span class="suggestion-tag" onclick="performSearch('silk')">Silk</span>
                <span class="suggestion-tag" onclick="performSearch('cotton')">Cotton</span>
                <span class="suggestion-tag" onclick="performSearch('wool')">Wool</span>
                <span class="suggestion-tag" onclick="performSearch('linen')">Linen</span>
                <span class="suggestion-tag" onclick="performSearch('velvet')">Velvet</span>
                <span class="suggestion-tag" onclick="performSearch('chiffon')">Chiffon</span>
            </div>
        </div>
    `;
}

// Perform search across products and offers
async function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer || !query) return;

    if (isSearching) return;
    isSearching = true;

    resultsContainer.innerHTML = `
        <div class="search-loading">
            <div class="search-spinner"></div>
            <span>Searching for "${query}"...</span>
        </div>
    `;

    try {
        // Ensure products are loaded
        let products = allProducts;
        if (!products || products.length === 0) {
            products = await fetchProducts();
            allProducts = products;
        }

        // Ensure offers are loaded
        let offers = allOffers;
        if (!offers || offers.length === 0) {
            offers = await fetchOffers();
            allOffers = offers;
        }

        const items = [...products, ...offers];
        const filtered = filterItems(items, query);
        displaySearchResults(filtered, query);
    } catch (err) {
        console.error('Search error:', err);
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Search Error</h3>
                <p>Unable to perform search. Please try again.</p>
            </div>
        `;
    } finally {
        isSearching = false;
    }
}

// Filter items by query
function filterItems(items, query) {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter(item => {
        const haystack = [
            item.name || '',
            item.type || '',
            item.description || '',
            item.branch || '',
            ...(Array.isArray(item.colors) ? item.colors : [])
        ].join(' ').toLowerCase();
        return terms.every(t => haystack.includes(t));
    });
}

// Render results grid
function displaySearchResults(results, query) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (!results || results.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No Results Found</h3>
                <p>No products found for "${query}". Try different keywords.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="search-results-header">
            <h4 style="color: var(--white); text-align: center; margin-bottom: 1.5rem; font-family: 'Cormorant Garamond', serif; font-size: 1.5rem;">
                Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"
            </h4>
        </div>
        <div class="search-results-grid">
            ${results.map(item => `
                <div class="search-result-card">
                    <img src="${item.images && item.images[0] ? item.images[0] : ''}" alt="${item.name}" class="search-result-img">
                    <div class="search-result-info">
                        <h3 class="search-result-name">${item.name}</h3>
                        <div class="search-result-price">${item.price_after || ''}</div>
                        <button class="search-result-btn" onclick="viewSearchResult(${item.id})">View Details</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Open item from search
function viewSearchResult(itemId) {
    closeSearchModal();
    const path = window.location.pathname;
    const onOffers = path.includes('Offers.html');
    const onProducts = path.includes('Products.html');

    if (onOffers) {
        // Ensure offers are loaded then open
        if (allOffers && allOffers.length) {
            openOfferDetails(parseInt(itemId));
        } else {
            // Navigate to offers with query param
            window.location.href = `Offers.html?item=${itemId}`;
        }
    } else {
        if (onProducts && allProducts && allProducts.length) {
            openProductDetails(parseInt(itemId));
        } else {
            window.location.href = `Products.html?item=${itemId}`;
        }
    }
}

// On load, check URL for direct item open
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const itemParam = params.get('item');
    if (itemParam) {
        const path = window.location.pathname;
        setTimeout(() => {
            if (path.includes('Offers.html')) {
                openOfferDetails(parseInt(itemParam));
            } else {
                openProductDetails(parseInt(itemParam));
            }
        }, 800);
    }
});

// Close search when clicking outside content
window.addEventListener('click', function(e) {
    const modal = document.getElementById('searchModal');
    if (e.target === modal) {
        closeSearchModal();
    }
});

// Close with Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('searchModal');
        if (modal && modal.style.display === 'block') {
            closeSearchModal();
        }
    }
});