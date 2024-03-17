//------------------------- USER PROFILE SECTION - CLIENT SIDE ---------------------------------

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

// FUNCTION FOR EDITING USER PROFILE DETAILS
document.getElementById("profile_Edit_submit_btn").addEventListener("click", async (event) =>{
    event.preventDefault()
    try {
        if(
            ! document.getElementById("username").value.trim() ||
            ! document.getElementById("firstname").value.trim() ||
            ! document.getElementById("lastname").value.trim() ||
            ! document.getElementById("email").value.trim() ||
            ! document.getElementById("mobile").value ||
            ! document.getElementById("DOB").value ||
            ! document.getElementById("country").value.trim() ||
            ! document.getElementById("state").value.trim() ||
            ! document.getElementById("district").value.trim() ||
            ! document.getElementById("zip").value ||
            ! document.getElementById("landmark").value.trim() ||
            ! document.getElementById("text_area").value.trim()
        ){
            document.getElementById("error_message").innerHTML = "Provide required datas"
            setTimeout(() => {
                document.getElementById("error_message").innerHTML = ""
            }, 4000);
        }else{
            const formdata = Object.fromEntries(new FormData(document.getElementById("user_profile_form")))
            const response = await axios.patch("/account/profile_Edit", formdata, {
                headers : {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = response.data

            if(result.success){
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Profile updated successfully",
                    showConfirmButton: false,
                    timer: 2500
                });
                setTimeout(() => {
                    window.location.href = "/account"
                }, 2500);
            }else{
                document.getElementById("error_message").innerHTML = "Couldn't update data"
                setTimeout(() => {
                    document.getElementById("error_message").innerHTML = ""
                }, 4000);
            }
        }
    } catch (error) {
        console.log(error);
    }
})