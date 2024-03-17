//------------------------- REMOVING BLOCKING USERS  - CLIENT SIDE ---------------------------------

// FUNCTION FOR DELETING USER
document.querySelectorAll(".bi-trash-fill").forEach(deleteBtn =>{
    deleteBtn.addEventListener("click", async (event)=>{
        event.preventDefault()
        const userId = deleteBtn.getAttribute("data-id");
        const userTr = deleteBtn.closest("tr")
        const errorMessage = document.getElementById("errorMessage")
        try {
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
                            text: "User has been deleted.",
                            icon: "success"
                            });

                            const url = `/admin/user_List/delete_User/${userId}`
                            const response = await axios.delete(url)
                            const result = response.data
                            
                            if(result.success){
                                userTr.remove()
                            }else{
                                errorMessage.innerHTML = "Failed"
                                setTimeout(() => {
                                    errorMessage.innerHTML = "" 
                                }, 4000);
                            }
                        } else if (
                            result.dismiss === Swal.DismissReason.cancel
                        ) {
                            swalWithBootstrapButtons.fire({
                            title: "Cancelled",
                            text: "Banner deletion cancelled",
                            icon: "error"
                            });
                        }
                    });   
        } catch (error) {
            console.log("user delete ",error.message);
        }
    })
})

// FUNCTION FOR BLOCKING USER
async function blockUser(e,userId){
    try {
        const icon = document.querySelector(".block_icon" + userId)

        if(icon.classList.contains("bi-person-fill")){
            document.getElementById("user_status"+userId).innerHTML = "Active"
            icon.classList.replace("bi-person-fill","bi-person-fill-slash")
        }else{
            icon.classList.replace( "bi-person-fill-slash","bi-person-fill")
            document.getElementById("user_status"+userId).textContent = "Blocked"
        }
        await axios.patch(`/admin/user_list/block?user_id=${userId}`)
    } catch (error) {
        console.log(error);
    }
} 