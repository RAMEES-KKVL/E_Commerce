document.getElementById("singleProductBuy").addEventListener("click", async (event)=>{
    event.preventDefault()
    try {
        const size = document.getElementById("product_Size").value
        const productId = document.getElementById("singleProductBuy").getAttribute("productId")

        const response = await axios.post(`/product?product_id=${productId}&size=${size}`)
        const result = response.data

        if(result.success){
            window.location.href = '/checkout'
        }
    } catch (error) {
        console.log(error);
    }
})


async function productBuy(){

}