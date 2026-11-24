/* =========================================
   1. INITIAL PRODUCT DATA
========================================= */

// Six default products

const defaultProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 89.99,
        category: "Electronics",
        description: "High-quality wireless headphones with excellent sound and noise cancellation.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },

    {
        id: 2,
        name: "Smart Watch",
        price: 129.99,
        category: "Electronics",
        description: "Modern smartwatch with fitness tracking and health monitoring features.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },

    {
        id: 3,
        name: "Running Shoes",
        price: 74.99,
        category: "Sports",
        description: "Comfortable running shoes designed for everyday activities and workouts.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },

    {
        id: 4,
        name: "Classic Backpack",
        price: 49.99,
        category: "Accessories",
        description: "A stylish and practical backpack with plenty of storage space.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    },

    {
        id: 5,
        name: "Modern Sunglasses",
        price: 35.50,
        category: "Accessories",
        description: "Fashionable sunglasses with UV protection and a modern design.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    },

    {
        id: 6,
        name: "Cotton T-Shirt",
        price: 24.99,
        category: "Clothing",
        description: "Soft cotton T-shirt with a comfortable fit for everyday wear.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    }
];


// Load products from localStorage.
// If there are no saved products, use the default products.

let products;

const savedProducts = localStorage.getItem("products");

if (savedProducts !== null) {
    products = JSON.parse(savedProducts);
} else {
    products = defaultProducts;
    localStorage.setItem("products", JSON.stringify(products));
}


/* =========================================
   2. SAVE PRODUCTS
========================================= */

function saveProducts() {

    localStorage.setItem("products", JSON.stringify(products));

}


/* =========================================
   3. ESCAPE HTML
========================================= */

// Prevent user-entered text from being interpreted as HTML.

function escapeHTML(value) {

    return $("<div>").text(String(value)).html();

}


/* =========================================
   4. DISPLAY PRODUCTS
========================================= */

function displayProducts(productList = products) {

    const grid = $("#products-grid");

    // Remove previous product cards.
    grid.empty();

    // Update total product count.
    $("#product-count").text(products.length);

    // Show message if no products exist.
    if (productList.length === 0) {

        $("#no-products").show();

        return;
    }

    $("#no-products").hide();

    // Generate product cards.
    $.each(productList, function(index, product) {

        const productHTML = `
            <div class="product-card" data-id="${product.id}">

                <div class="product-image">

                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                    >

                </div>

                <div class="product-info">

                    <span class="product-category">
                        ${escapeHTML(product.category)}
                    </span>

                    <h3>${escapeHTML(product.name)}</h3>

                    <p class="product-description">
                        ${escapeHTML(product.description)}
                    </p>

                    <button class="description-toggle">
                        Show / Hide Description
                    </button>

                    <div class="product-price">
                        $${Number(product.price).toFixed(2)}
                    </div>

                    <div class="product-actions">

                        <button
                            class="add-cart-btn"
                            data-id="${product.id}"
                        >
                            🛒 Add to Cart
                        </button>

                        <button
                            class="edit-product-btn"
                            data-id="${product.id}"
                            title="Edit Product"
                        >
                            ✏️
                        </button>

                        <button
                            class="delete-product-btn"
                            data-id="${product.id}"
                            title="Delete Product"
                        >
                            🗑️
                        </button>

                    </div>

                </div>

            </div>
        `;

        grid.append(productHTML);

    });

}


/* =========================================
   5. OPEN PRODUCT MODAL
========================================= */

$("#open-product-modal").click(function() {

    // Prepare the form for a new product.
    $("#product-form")[0].reset();

    $("#edit-product-id").val("");

    $("#modal-title").text("Add New Product");

    $("#submit-product").text("Add Product");

    $(".error-message").text("");

    $("#product-modal").css("display", "flex").hide().fadeIn(250);

});


/* =========================================
   6. CLOSE PRODUCT MODAL
========================================= */

function closeProductModal() {

    $("#product-modal").fadeOut(250);

}

$("#close-product-modal").click(closeProductModal);

$("#cancel-product").click(closeProductModal);


// Close modal when clicking outside the form.
$("#product-modal").click(function(event) {

    if ($(event.target).is("#product-modal")) {
        closeProductModal();
    }

});


/* =========================================
   7. ADD / EDIT PRODUCT
========================================= */

$("#product-form").submit(function(event) {

    // Prevent the page from refreshing.
    event.preventDefault();


    // Get values from the form.
    const name = $("#product-name").val().trim();

    const price = $("#product-price").val();

    const category = $("#product-category").val();

    const description = $("#product-description").val().trim();

    const image = $("#product-image").val().trim();

    const editId = $("#edit-product-id").val();


    // Reset previous errors.
    $(".error-message").text("");

    let isValid = true;


    // Validate product name.
    if (name.length < 3) {

        $("#name-error").text(
            "Product name must contain at least 3 characters."
        );

        isValid = false;
    }


    // Validate price.
    if (price === "" || !Number.isFinite(Number(price)) || Number(price) <= 0) {

        $("#price-error").text(
            "Price must be greater than 0."
        );

        isValid = false;
    }


    // Validate category.
    if (category === "") {

        $("#category-error").text(
            "Please select a category."
        );

        isValid = false;
    }


    // Validate description.
    if (description === "") {

        $("#description-error").text(
            "Description cannot be empty."
        );

        isValid = false;
    }


    // Validate image URL.
    try {

        const imageURL = new URL(image);

        if (!["http:", "https:"].includes(imageURL.protocol)) {
            throw new Error("Invalid image URL");
        }

    } catch (error) {

        $("#image-error").text(
            "Please enter a valid image URL."
        );

        isValid = false;
    }


    // Stop if validation fails.
    if (!isValid) {
        return;
    }


    // Create product object.
    const productData = {

        id: editId ? Number(editId) : Date.now(),

        name: name,

        price: Number(price),

        category: category,

        description: description,

        image: image

    };


    // Check whether we are editing or adding.
    if (editId !== "") {

        // Find existing product.
        const index = products.findIndex(function(product) {

            return product.id === Number(editId);

        });

        if (index !== -1) {

            products[index] = productData;

        }

    } else {

        // Add new product to the beginning.
        products.unshift(productData);

    }


    // Save changes.
    saveProducts();


    // Refresh product display.
    displayProducts();


    // Animate the newly added product.
    if (editId === "") {

        const newCard = $(
            `.product-card[data-id="${productData.id}"]`
        );

        newCard.hide().slideDown(400);

    }


    // Reset the form.
    $("#product-form")[0].reset();

    $("#edit-product-id").val("");

    // Close modal.
    closeProductModal();

});


/* =========================================
   8. EDIT PRODUCT
========================================= */

$("#products-grid").on("click", ".edit-product-btn", function() {

    const productId = Number($(this).attr("data-id"));

    // Find selected product.
    const product = products.find(function(item) {

        return item.id === productId;

    });

    if (!product) {
        return;
    }


    // Fill form with existing information.
    $("#edit-product-id").val(product.id);

    $("#product-name").val(product.name);

    $("#product-price").val(product.price);

    $("#product-category").val(product.category);

    $("#product-description").val(product.description);

    $("#product-image").val(product.image);


    // Change modal title and button.
    $("#modal-title").text("Edit Product");

    $("#submit-product").text("Save Changes");

    $(".error-message").text("");


    // Open modal.
    $("#product-modal").css("display", "flex").hide().fadeIn(250);

});


/* =========================================
   9. DELETE PRODUCT
========================================= */

$("#products-grid").on("click", ".delete-product-btn", function() {

    const button = $(this);

    const productId = Number(button.attr("data-id"));

    // Find product card.
    const card = button.closest(".product-card");

    // Fade out animation.
    card.fadeOut(400, function() {

        // Remove product from array.
        products = products.filter(function(product) {

            return product.id !== productId;

        });

        // Save changes.
        saveProducts();

        // Refresh product display.
        displayProducts();

    });

});


/* =========================================
   10. DESCRIPTION TOGGLE
========================================= */

$("#products-grid").on("click", ".description-toggle", function() {

    const card = $(this).closest(".product-card");

    card.find(".product-description").toggle();

});


/* =========================================
   11. DOUBLE CLICK EVENT
========================================= */

// Double-click on a product card to
// show or hide its price.

$("#products-grid").on("dblclick", ".product-card", function() {

    $(this).find(".product-price").fadeToggle(300);

});


/* =========================================
   12. MOUSE ENTER EVENT
========================================= */

$("#products-grid").on("mouseenter", ".product-card", function() {

    $(this).find(".product-image").animate({

        height: "205px"

    }, 200);

});


/* =========================================
   13. MOUSE LEAVE EVENT
========================================= */

$("#products-grid").on("mouseleave", ".product-card", function() {

    $(this).find(".product-image").animate({

        height: "190px"

    }, 200);

});


/* =========================================
   14. INITIALIZE PRODUCTS
========================================= */

$(document).ready(function() {

    displayProducts();

});

/* =========================================
   15. SEARCH AND FILTER VARIABLES
========================================= */

let currentSearch = "";
let currentCategory = "all";
let currentSort = "default";


/* =========================================
   16. APPLY SEARCH AND FILTERS
========================================= */

function applyFilters() {

    let filteredProducts = [...products];


    // SEARCH BY PRODUCT NAME

    filteredProducts = filteredProducts.filter(function(product) {

        return product.name
            .toLowerCase()
            .includes(currentSearch.toLowerCase());

    });


    // FILTER BY CATEGORY

    if (currentCategory !== "all") {

        filteredProducts = filteredProducts.filter(function(product) {

            return product.category === currentCategory;

        });

    }


    // SORT BY PRICE

    if (currentSort === "low-to-high") {

        filteredProducts.sort(function(a, b) {

            return a.price - b.price;

        });

    }

    else if (currentSort === "high-to-low") {

        filteredProducts.sort(function(a, b) {

            return b.price - a.price;

        });

    }


    // DISPLAY FILTERED PRODUCTS

    displayProducts(filteredProducts);

}


/* =========================================
   17. LIVE SEARCH - KEYUP EVENT
========================================= */

$("#search-input").keyup(function() {

    currentSearch = $(this).val().trim();

    applyFilters();

});


/* =========================================
   18. CLEAR SEARCH
========================================= */

$("#clear-search").click(function() {

    $("#search-input").val("");

    currentSearch = "";

    applyFilters();

});


/* =========================================
   19. CATEGORY FILTER - CHANGE EVENT
========================================= */

$("#category-filter").change(function() {

    currentCategory = $(this).val();

    // Update sidebar selection.
    $(".category-item").removeClass("active");

    $(`.category-item[data-category="${currentCategory}"]`)
        .addClass("active");

    applyFilters();

});


/* =========================================
   20. SIDEBAR CATEGORY FILTER
========================================= */

$(".category-list").on("click", ".category-item", function() {

    currentCategory = $(this).attr("data-category");

    // Update active category.
    $(".category-item").removeClass("active");

    $(this).addClass("active");

    // Synchronize category dropdown.
    $("#category-filter").val(currentCategory);

    applyFilters();

});


/* =========================================
   21. PRICE SORTING
========================================= */

$("#price-sort").change(function() {

    currentSort = $(this).val();

    applyFilters();

});
