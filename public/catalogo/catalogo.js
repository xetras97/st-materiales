window.onload = async() => {
    const productsList = await (await fetch ("/api/products")).json();
    console.log(productsList);
    displayCatalogo(productsList);
}

function displayCatalogo (productsList) {
    let productsHTML = ``;
    
    for (let p = 0; p < 12; p++) {
        const product = productsList[p];
        productsHTML += `
        <div class="col-6 col-md-4 col-lg-3 mt-2 card-container">
            <a href="#" class="text-dark" style="text-decoration: none;">
                <div class="card h-100">
                    <img src="../${product.image}" class="img-fluid card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <span class="badge text-dark badge-price">$${product.price}</span>
                        <h5 class="card-title">${product.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${product.description}</h6>
                    </div>
                </div>
            </a>
        </div>
        `;    
    }

    document.getElementById("catalogo-row").innerHTML = productsHTML;
}
