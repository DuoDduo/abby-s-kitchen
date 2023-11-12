let cartItems = [];
let isPaymentProcessing = false;
let isPaymentSuccessful = false;
let productsData = [];
let productList;
let productSearchInput;

async function fetchProducts() {
    try {
        const response = await fetch("products.json");
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Error fetching product data:", error);
        return [];
    }
}

function generateProductHTML(product) {
    const productHTML = `
        <div class="product" bid-product>
            <img src="images/${product.image}" alt="${product.productName}" class="products-images">
            <div class="product-details">
            <h2>${product.productName}</h2>
            <p>₦${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button class="add-to-cart" data-product-id="${product.productId}">Add to Cart</button>
            ${generateStarRatingHTML(product.productId)}
            </div>
        </div>
    `;
    return productHTML;
}


function generateStarRatingHTML(productId) {
    return `
        <!-- Star rating icons -->
        <div class="star-rating star" data-product-id="${productId}">
            <i class="fas fa-star star" data-rating="1"></i>
            <i class="fas fa-star star" data-rating="2"></i>
            <i class="fas fa-star star" data-rating="3"></i>
            <i class="fas fa-star star" data-rating="4"></i>
            <i class="fas fa-star star" data-rating="5"></i>
        </div>
    `;
}

function filterProducts(searchTerm, selectedCategory) {
    return productsData.filter((product) => {
        const productNameMatches = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatches = selectedCategory === "all" || product.category === selectedCategory;
        return productNameMatches && categoryMatches;
    });
}

function filterProductsByPrice(products, minPrice, maxPrice) {
    return products.filter((product) => {
        const productPrice = parseFloat(product.price);
        return productPrice >= minPrice && productPrice <= maxPrice;
    });
}
function attachStarRatingListenersToProduct(productElement) {
    const starIcons = productElement.querySelectorAll(".star");

    starIcons.forEach((star) => {
        star.addEventListener("click", (event) => {
            const productId = productElement.querySelector(".add-to-cart").dataset.productId;
            const rating = parseInt(star.dataset.rating);

            // Assuming you have a productsData array, find the product by productId
            const product = productsData.find((product) => product.productId === productId);

            if (product) {
                // Update the product's rating in the data structure
                product.rating = rating;

                // Add a class to visually highlight the selected rating
                starIcons.forEach((s) => {
                    if (parseInt(s.dataset.rating) <= rating) {
                        s.classList.add("selected");
                    } else {
                        s.classList.remove("selected");
                    }
                });
            }
        });
    });
}
function updateProductList(products) {
    productList.innerHTML = ""; // Clear the product list

    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.innerHTML = generateProductHTML(product);

        // Add the product element to the product list
        productList.appendChild(productElement);

        // Attach star rating event listeners to this product element
        attachStarRatingListenersToProduct(productElement); // Add this line
    });
}

// Event listener for the "Filter" button
const filterButton = document.getElementById("filter-button");
filterButton.addEventListener("click", () => {
    const minPriceInput = document.getElementById("min-price");
    const maxPriceInput = document.getElementById("max-price");

    // Get the user's filtering criteria
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Number.POSITIVE_INFINITY;

    // Filter the products based on the criteria
    const filteredProducts = filterProductsByPrice(productsData, minPrice, maxPrice);

    // Update the product list with the filtered products
    updateProductList(filteredProducts);
});

function addToCart(productId, productName, price, description) {
    console.log(`Adding product ${productId} to cart...`);

    const existingItem = cartItems.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity++;
        alert(`You Increased quantity for ${productName} to ${existingItem.quantity}`);
    } else {
        cartItems.push({ productId, productName, price, quantity: 1, description });
        alert(`You Added ${productName} to the cart`);
    }

    console.log("Cart items after addition:", cartItems);

    updateCartDisplay();
    updateCartBadge();
    updateCartTotalPrice();
    saveCartItemsToLocalStorage();
}
// Function to update the cart badge with the total item count
function updateCartBadge() {
    const cartBadge = document.getElementById("cart-badge");
    const totalItems = calculateTotalItems();
    cartBadge.textContent = totalItems;
}

// Function to calculate the total number of items in the cart
function calculateTotalItems() {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
}

// Function to update the cart display with the current cart items
function updateCartDisplay() {
    const cartList = document.getElementById("cart-items");
    cartList.innerHTML = ""; // Clear the cart items

    cartItems.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.productName} - ${item.price} x ${item.quantity}</span>
            <p>${item.description}</p>
            <button class="remove-item btn-primary" data-product-id="${item.productId}">Remove</button>
        `;
        cartList.appendChild(li);
    });
}


function calculateTotalPrice() {
    return cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

function updateCartTotalPrice() {
    const cartTotalPrice = document.getElementById("cart-total-price");
    const totalPrice = calculateTotalPrice();
    cartTotalPrice.textContent = `₦${totalPrice.toFixed(2)}`;
}

function saveCartItemsToLocalStorage() {
    const cartItemsJSON = JSON.stringify(cartItems);
    localStorage.setItem("cartItems", cartItemsJSON);
}

function loadCartItemsFromLocalStorage() {
    const cartItemsJSON = localStorage.getItem("cartItems");
    if (cartItemsJSON) {
        cartItems = JSON.parse(cartItemsJSON);
    }
}
// Function to remove a product from the cart
function removeCartItem(productId) {
    const index = cartItems.findIndex(item => item.productId === productId);
    if (index !== -1) {
        if (cartItems[index].quantity > 1) {
            cartItems[index].quantity--;
        } else {
            cartItems.splice(index, 1);
        }
        updateCartDisplay();
        updateCartBadge();
        updateCartTotalPrice();
        saveCartItemsToLocalStorage();
    }
}

async function init() {
    productsData = await fetchProducts();
    productList = document.getElementById("product-list");
    productSearchInput = document.getElementById("product-search");
    const searchButton = document.getElementById("search-button");

    loadCartItemsFromLocalStorage();

    if (productsData.length === 0) {
        productList.innerHTML = "<p>No products available.</p>";
        return;
    }

    // Add click event listeners to each category filter link
    const categoryFilterLinks = document.querySelectorAll('.category-filter-link');
    categoryFilterLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the link from navigating

            // Get the selected category from the link's data-category attribute
            const selectedCategory = link.getAttribute('data-category');

            // Get the current search term
            const searchTerm = productSearchInput.value;

            // Filter the products based on the selected category
            const filteredProducts = filterProducts(searchTerm, selectedCategory);

            // Update the product list with the filtered products
            updateProductList(filteredProducts);
        });
    });

    productSearchInput.addEventListener("input", () => {
        const searchTerm = productSearchInput.value;
        const selectedCategory = document.querySelector('.category-filter-link.active')?.getAttribute('data-category') || 'all';
        const filteredProducts = filterProducts(searchTerm, selectedCategory);
        updateProductList(filteredProducts);
    });

    searchButton.addEventListener("click", () => {
        const searchTerm = productSearchInput.value;
        const selectedCategory = document.querySelector('.category-filter-link.active')?.getAttribute('data-category') || 'all';
        const filteredProducts = filterProducts(searchTerm, selectedCategory);
        updateProductList(filteredProducts);
    });

productList.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("add-to-cart")) {
        const productId = event.target.dataset.productId;
        const productName = event.target.parentNode.querySelector("h2").textContent;
        const price = parseFloat(event.target.parentNode.querySelector("p").textContent.replace("₦", ""));
        const description = event.target.parentNode.querySelector("p").textContent;
        
        addToCart(productId, productName, price, description); // Call addToCart with the product details
    }
});



    // Update product list with all products initially
    updateProductList(productsData);
    updateCartDisplay();
    updateCartBadge();
    updateCartTotalPrice();
}

init();

// Define the toggleCart function
function toggleCart() {
    const cartModal = document.getElementById("cart-modal");
    const pageContent = document.getElementById("page");
    const continueShoppingButton = document.getElementById("continue-shopping");

    if (cartModal.style.display === "none" || cartModal.style.display === "") {
        cartModal.style.display = "block";
        pageContent.style.display = "none";
        continueShoppingButton.style.display = "block"; // Show the "Continue Shopping" button
    } else {
        cartModal.style.display = "none";
        pageContent.style.display = "block";
        continueShoppingButton.style.display = "none"; // Hide the "Continue Shopping" button
    }
}

// Define the continueShopping function
function continueShopping() {
    const cartModal = document.getElementById("cart-modal");
    const pageContent = document.getElementById("page");
    const continueShoppingButton = document.getElementById("continue-shopping");

    cartModal.style.display = "none";
    pageContent.style.display = "block";
    continueShoppingButton.style.display = "none"; // Hide the "Continue Shopping" button
}




// Function to display the payment form
function showPaymentForm() {
    const paymentForm = document.getElementById("payment-form");
    paymentForm.style.display = "block";
    
    // Hide the "Continue Shopping" button when the payment form is displayed
    hideContinueShoppingButton();
}

// Function to handle the "Back to Products" button
function backToProducts() {
    const cartModal = document.getElementById("cart-modal");
    const emptyCartMessage = document.getElementById("empty-cart-message");
    const pageContent = document.getElementById("page-content");

    // Hide the cart modal and empty cart message, show the page content
    cartModal.style.display = "none";
    emptyCartMessage.style.display = "none";
    pageContent.style.display = "block";

    // Show the "Continue Shopping" button
    showContinueShoppingButton();
}

// ... (Your existing JavaScript code) ...





document.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("remove-item")) {
        const productId = event.target.dataset.productId;
        removeCartItem(productId);
    }
});

document.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("star")) {
        const productId = event.target.parentNode.dataset.productId;
        const productName = event.target.parentNode.dataset.productName;
        const starRatingContainer = document.querySelector(`.star-rating[data-product-id="${productId}"]`);
        const clickedStarIndex = Array.from(starRatingContainer.querySelectorAll(".star")).indexOf(event.target);

        // Calculate the corresponding rating (e.g., 3.5 for 3.5 stars)
        const userRating = clickedStarIndex + 1;

        // For this example, we'll display an alert with the user's rating.
        alert(`You gave ${userRating} stars, for ${productName} thanks for rating`);

        // Add or remove the "red-star" class to toggle the color
        starRatingContainer.querySelectorAll(".star").forEach((star, index) => {
            if (index <= clickedStarIndex) {
                star.classList.add("red-star");
            } else {
                star.classList.remove("red-star");
            }
        });
    }
    })

// Define the showPaymentForm function
function showPaymentForm() {
   
    const paymentForm = document.getElementById("payment-form");
    paymentForm.style.display = "block";
    paymentForm.style.flexDirection="column";
    paymentForm.style.gap="10px";
    paymentForm.style.padding="10px"
}

// Function to process payment
function processPayment() {
    if (isPaymentProcessing || cartItems.length === 0) {
        return;
    }

    const cardNumberInput = document.getElementById("card-number");
    const expDateInput = document.getElementById("exp-date");
    const cvvInput = document.getElementById("cvv");

    const cardNumber = cardNumberInput.value.trim();
    const expDate = expDateInput.value.trim();
    const cvv = cvvInput.value.trim();

    // Perform form validation here
    if (!cardNumber || !expDate || !cvv) {
        alert("Please fill out all payment details.");
        return;
    }

    // Validate card number format
    const cardNumberPattern = /^\d{10}$/; // Assuming a 10-digit card number
    if (!cardNumberPattern.test(cardNumber)) {
        alert("Invalid card number format.");
        return;
    }

    // Validate expiration date (assuming format MM/YYYY)
    const expDatePattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
    if (!expDatePattern.test(expDate)) {
        alert("Invalid expiration date format. Please use MM/YYYY.");
        return;
    }

    const today = new Date();
    const [expMonth, expYear] = expDate.split("/");
    const expDateObj = new Date(expYear, expMonth - 1, 1);

    if (expDateObj <= today) {
        alert("Card has expired. Please provide a valid card.");
        return;
    }

    // Validate CVC format
    const cvvPattern = /^\d{3}$/; // Assuming a 3-digit CVC
    if (!cvvPattern.test(cvv)) {
        alert("Invalid CVV format. Please provide a valid CVV.");
        return;
    }

    // Perform payment processing simulation
    simulatePaymentProcessing(cardNumber, expDate, cvv);
}

// Add event listener to the "Process Payment" button
const processPaymentButton = document.getElementById("process-payment");
processPaymentButton.addEventListener("click", processPayment);
// Define the clearCartItems function
function clearCartItems() {
    cartItems = [];
}
// Function to simulate payment processing
function simulatePaymentProcessing(cardNumber, expDate, cvv) {
    const totalPrice = calculateTotalPrice();

    setTimeout(() => {
        const isSuccess = Math.random() < 0.8; // 80% success rate
        isPaymentSuccessful = isSuccess;

        const message = isSuccess
            ? `Payment successful! Thank you for your purchase. Total amount: ₦${totalPrice.toFixed(2)}`
            : "Payment failed. Please try again.";

        alert(message);

        if (!isSuccess) {
            // Payment failed, display cart items and payment form again
            const cart = document.getElementById("cart");
            const paymentForm = document.getElementById("payment-form");
            const page = document.getElementById("page");
            page.style.display = "none";
            cart.style.display = "block";
            paymentForm.style.display = "block";
        } else {
            // Payment successful
            clearCartItems(); // Clear the cart items
            updateCartBadge();
            updateCartTotalPrice();
            updateCartDisplay(); // Update the cart display

            // Hide the payment form
            const paymentForm = document.getElementById("payment-form");
            paymentForm.style.display = "none";
        }

        document.getElementById("payment-form").reset();
        document.getElementById("page").style.display = "block";
        document.getElementById("cart").style.display = "none";
        document.getElementById("payment-processing-message").style.display = "none";

        isPaymentProcessing = false;
    }, 2000);
}





