//------------------------- CART SECTION - CLIENT SIDE ---------------------------------

// FUNCTION FOR ADDING PRODUCT TO CART
async function addtoCart(event, productId){
    event.stopPropagation()
    try {
        const productSizeElement = document.getElementById("product_Size");
        const size = productSizeElement ? productSizeElement.value : 'S';
        const response = await axios.patch(`/cart/add_Item?product_id=${productId}&size=${size}`)
        const result = response.data
        if(!result.success){
            if(result.gotoCart){
                window.location.href = "/cart"
            }else if(result.noUser){
                window.location.href = "/login"
            }
        }else{
            document.querySelector(".addto_cart_btn" + productId).innerHTML = "GO TO CART <i class='bi bi-arrow-right-short'></i>"
            document.querySelector(".cart_count").innerHTML = Number(document.querySelector(".cart_count").innerHTML) + 1
        }
    } catch (error) {
        console.log(error);
    }
}

// FUNCTION FOR REMOVING PRODUCT FROM CART
async function deleteCartItem(event, productId){
    event.stopPropagation()
    try {
        const response = await axios.delete(`/cart/delete_Item?product_id=${productId}`)
        const result = response.data

        if(result.success){
            document.querySelector(`.product${productId}`).remove()
            window.location.reload()
        }else{
            document.getElementById("error").innerHTML = "Couldn't delete cart item"
        }
    } catch (error) {
        console.log(error);
    }
}

// FUNCTION FOR CHOOSING PRODUCT QUANTITY FROM CART
async function selectQuantity(event, productId){
    event.stopPropagation()
 
    document.querySelector(".quantity_count" + productId).addEventListener("change",async (element) => {
        try {
            element.preventDefault()
            const value = element.target.value
            const response = await axios.patch(`/cart/updateQuantity?product_id=${productId}`,{value})
            const result = response.data

            if(result.success){
                window.location.reload()
            }
        } catch (error) {
            console.log(error);
        }
    });   
}