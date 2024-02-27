async function addtoCart(event, productId){
    event.stopPropagation()
    try {
        const response = await axios.patch(`/cart/add_Item?product_id=${productId}`)
        const result = response.data

        if(!result.success){
            if(result.gotoCart){
                window.location.href = "/cart"
            }else if(result.noUser){
                window.location.href = "/login"
            }
        }else{
            document.querySelector(".addto_cart_btn" + productId).innerHTML = "GO TO CART <i class='bi bi-arrow-right-short'></i>"
        }
    } catch (error) {
        console.log(error);
    }
}


async function deleteCartItem(event, productId){

    event.stopPropagation()
    try {
        const response = await axios.delete(`/cart/delete_Item?product_id=${productId}`)
        const result = response.data

        if(result.success){
            document.querySelector(`.product${productId}`).remove()
        }else{
            document.getElementById("error").innerHTML = "Couldn't delete cart item"
        }
    } catch (error) {
        console.log(error);
    }
}


async function selectQuantity(event, productId){
    event.stopPropagation()
 
    document.querySelector(".quantity_count" + productId).addEventListener("change",async (element) => {
        try {
            element.preventDefault()
            const value = element.target.value
            console.log(value);
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