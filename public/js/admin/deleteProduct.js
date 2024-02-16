
// CLIENT SIDE ACTION FOR DELETING REQUIRED PRODUCT 

document.querySelectorAll(".bi-trash-fill").forEach(deleteBtn =>{
    deleteBtn.addEventListener("click", async (event)=>{
        event.preventDefault()
        try {
            const productId = deleteBtn.getAttribute("data-id")
            const response = await axios.delete(`/admin/products/delete_Product?productId=${productId}`)
            const result = await response.data
            
            if(result.success){
                deleteBtn.closest("tr").remove() 
            }else{
                if(productIssue){
                    document.getElementById("errorMessage_dlt").innerHTML = "Failed"
                    setTimeout(() => {
                        document.getElementById("errorMessage_dlt").innerHTML = ""
                    }, 4000);
                }
                else if(deleteIssue){
                    document.getElementById("errorMessage_dlt").innerHTML = "productIssue"
                    setTimeout(() => {
                        document.getElementById("errorMessage_dlt").innerHTML = ""
                    }, 4000);
                } 
            }
        } catch (error) {
            console.log(error);
        }
    })
})