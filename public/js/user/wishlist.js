//------------------------- FUNCTION FOR ADDING PRODUCT TO WISHLIST - CLIENT SIDE ---------------------------------

async function wishlistUpdate(event, productId){
    event.stopPropagation() 
    try { 
        const response = await axios.patch(`/wishlist/patch_Item?productId=${productId}`)
        const result = response.data

        if(result.success){
            const icon = document.querySelector(".wishlist_heart" + productId) 
            if(icon.classList.contains('bi-heart')){
                icon.classList.replace('bi-heart','bi-heart-fill')
                document.querySelector(".wish_count_top").innerHTML = Number(document.querySelector(".wish_count_top").innerHTML) + 1
            }else{
                icon.classList.replace('bi-heart-fill','bi-heart')
                document.querySelector(".wish_count_top").innerHTML = Number(document.querySelector(".wish_count_top").innerHTML) - 1
            }
        }else{
            location.href = "/wishlist"
        }
    } catch (error) {
        console.log(error);
    }
}

// FUNCTION FOR REMOVING PRODUCT FROM WISHLIST
async function wishDelete(event, productId){
    event.stopPropagation()
    try {
        const response = await axios.delete(`/wishlist/delete_Item?productId=${productId}`)
        const result = response.data

        if(result.success){
            document.getElementById("wish_pic_remove"+productId).remove()
            document.querySelector(".wish_count_top").innerHTML = Number(document.querySelector(".wish_count_top").innerHTML) - 1
        }else{
            document.getElementById("error").innerHTML = "Couldn't delete wishlist item"
        }
    } catch (error) {
        console.log(error);
    }
}