//------------------------- PRODUCT EDIT SECTION - CLIENT SIDE ---------------------------------

// FUNCTION FOR IMAGE PREVIEW
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

// FUNCTION FOR VIEW SUBCATEGORY IF EXISTS 
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

// FUNCTION FOR EDITING PRODUCT DETAILS 
document.getElementById("edit_product_btn").addEventListener("click", async (event)=>{
    event.preventDefault()

    try {
        const productName = document.getElementById("productName").value.trim()
        const price = document.getElementById("price").value
        const discount = document.getElementById("discount").value
        const stock = document.getElementById("stock").value
        const category = document.getElementById("category").value
        const deliveryDate = document.getElementById("deliveryDate").value
        const size = document.getElementById("size").value
        const descriptions = document.getElementById("descriptions").value.trim()

        if(!productName || !price || !discount || !stock || !category || !deliveryDate || !size || !descriptions){
            document.getElementById("errorMain").innerHTML = "Provide required datas"
            setTimeout(() => {
                document.getElementById("errorMain").innerHTML = ""
            }, 4000);
        }else{
            const product_id = document.getElementById("edit_product_btn").getAttribute("product-id")
            const formData = new FormData(document.getElementById("edit_product_form"))

            const response = await axios.post(`/admin/products/edit_product?product_id=${product_id}`, formData, {
                headers : {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = response.data

            if(result.success){
                if(result.oldArray){
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Product updated successfully",
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
                else if(result.newArray){
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Product updated successfully",
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            }else if(!result.success){
                if(!result.oldArray){
                    document.getElementById("errorMain").innerHTML = "Failed upadating product...!"
                    setTimeout(() => {
                        document.getElementById("errorMain").innerHTML = ""
                    }, 4000);
                }
                else if(!result.newArray){
                    document.getElementById("errorMain").innerHTML = "Failed upadating product...!"
                    setTimeout(() => {
                        document.getElementById("errorMain").innerHTML = ""
                    }, 4000);
                }  
            }
        }
    } catch (error) {
        console.log(error);
    }
})