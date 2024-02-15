// const { set } = require("mongoose")

const addButtn = document.getElementById("add_product_btn")
const errorMain = document.getElementById("errorMain")


function previewImage(input){
    const file = input.files[0]
    if(file){
        const reader = new FileReader()
        reader.onload = (e)=>{
            document.getElementById("imagePreview").src = e.target.result
        }
        reader.readAsDataURL(file)
    }
} 

async function categoryView(event){
    try {
        const categoryName = event.target.value
        const response = await axios.get(`/admin/product/subcategory_find?categoryName=${categoryName}`)
        const result = response.data

        if(result.success){
            document.getElementById("subcategory_display_div").style.display = "block"
        }else{
            document.getElementById("subcategory_display_div").style.display = "none"
        }
    } catch (error) { 
        console.log(error);
    } 
} 

addButtn.addEventListener("click", async (event)=>{
    event.preventDefault()

    try {
        const productName = document.getElementById("productName").value.trim()
        const price = document.getElementById("price").value.trim()
        const discount = document.getElementById("discount").value.trim()
        const stock = document.getElementById("stock").value.trim()
        const category = document.getElementById("category").value
        const deliveryDate = document.getElementById("deliveryDate").value
        const colour = document.getElementById("colour").value
        const productImage = document.getElementById("productImage").files[0]

        if(!productName || !price || !discount || !stock || !category || !deliveryDate || !colour || !productImage ){
            errorMain.innerHTML = "Fill all fields"
            setTimeout(() => {
                errorMain.innerHTML = ""               
            }, 4000);
        }else{
            const form = document.getElementById("add_product_form")
            const product = new FormData(form)

            const response = await axios.post("/admin/products/add_Product",product,{
                headers: {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = await response.data
    
            if(result.success){
                document.getElementById("productName").value = ""
                document.getElementById("price").value = ""
                document.getElementById("discount").value = ""
                document.getElementById("stock").value = ""
                document.getElementById("category").value = ""
                document.getElementById("subCategory").value = ""
                document.getElementById("deliveryDate").value = ""
                document.getElementById("colour").value = ""
                document.getElementById("size").value = ""
                document.getElementById("descriptions").value = ""
                document.getElementById("imagePreview").src = ""
                
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Product added successfully",
                    showConfirmButton: false,
                    timer: 2500
                  });
            }else{
                if(!result.success){

                    errorMain.innerHTML = "Product already exist"
                    setTimeout(() => {
                        errorMain.innerHTML = ""               
                    }, 4000);
                }
            }
        } 
    } catch (error) {
        console.log("add product ",error.message);
    }
})