//------------------------- FUNCTIONS FOR SHOWING CART, WISHLIST COUNTS - CLIENT SIDE ---------------------------------

document.addEventListener("DOMContentLoaded", async ()=>{
    try {
        const response = await axios.get("/count")
        const result = response.data
        const cartCount = parseInt(result.cartCount)
        const wishlistCount = parseInt(result.wishlistCount)

        document.querySelector(".cart_count").innerHTML = cartCount
        document.querySelector(".wish_count_top").innerHTML = wishlistCount
    } catch (error) {
        console.log(error);
    }
})

// FUNCTION FOR SEARCHBAR
function search(){
    const search = document.getElementById("searchBar_input").value.trim()
    if(search){
        window.location.href = `/all_products?search=${search}`
    }
}