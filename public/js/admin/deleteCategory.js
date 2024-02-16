document.querySelectorAll(".bi-trash-fill").forEach(deleteBtn =>{
    deleteBtn.addEventListener("click", async (event)=>{
        event.preventDefault()
        try {
            const categoryId = deleteBtn.getAttribute("category-id")

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
                        text: "Category has been deleted.",
                        icon: "success"
                        });

                        const response = await axios.delete(`/admin/category/delete_Category?categoryId=${categoryId}`)
                        const result = response.data

                        if(result.success){
                            deleteBtn.closest("tr").remove()
                        }else{
                            document.getElementById("errormsg").innerHTML = "Fail"
                            setTimeout(() => {
                                document.getElementById("errormsg").innerHTML = "Fail"
                            }, 4000);
                        }
                    } else if (
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        swalWithBootstrapButtons.fire({
                        title: "Cancelled",
                        text: "Category deletion cancelled",
                        icon: "error"
                        });
                    }
                });

        } catch (error) {
            console.log(error);
        }
    })
})