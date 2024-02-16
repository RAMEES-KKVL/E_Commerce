
// CLIENT SIDE ACTION FOR DELETING REQUIRED PRODUCT 

document.querySelectorAll(".bi-trash-fill").forEach(deleteBtn =>{
    deleteBtn.addEventListener("click", async (event)=>{
        event.preventDefault()
        try {
            const productId = deleteBtn.getAttribute("data-id")

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
                });
                swalWithBootstrapButtons.fire({

                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true,
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary'
                }}).then( async (result) => {
                    if (result.isConfirmed) {
                        swalWithBootstrapButtons.fire({
                        title: "Deleted!",
                        text: "Product has been deleted.",
                        icon: "success"
                        });

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
                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Product deletion cancelled",
                        icon: "error"
                        });
                    }
                });
            
        } catch (error) {
            console.log(error);
        }
    })
})