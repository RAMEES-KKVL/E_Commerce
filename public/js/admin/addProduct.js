const addButtn = document.getElementById("add_product_btn")
const form = document.getElementById("add_product_form")


addButtn.addEventListener("click", async (event)=>{
    event.preventDefault()

    const formBody = new FormData(form)
    const product = Object.fromEntries(formBody)
    try {
        const response = await axios.post("/admin/products/add_Product",product)
        const result = await response.data

        if(result.success){
            window.location.href = "/admin/products"
        }else{
            
        }
        
    } catch (error) {
        console.log("add product ",error.message);
    }
})