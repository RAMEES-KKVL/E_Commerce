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

// FUNCTION FOR ADDING USER PROFILE DETAILS
document.querySelector(".update_profile_btn").addEventListener("click", async (event)=>{
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
            const response = await axios.post("/account/profile", formdata, {
                headers : {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = response.data

            if(result.success){
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Profile added successfully",
                    showConfirmButton: false,
                    timer: 2500
                });

                document.getElementById("edit_profile_btn").style.display = 'block'
                document.getElementById("choose_img_btn").style.display = 'none'
                document.getElementById("addProfile_btn").style.display = 'none'
            }else{
                if(result.missingData){
                    document.getElementById("error_message").innerHTML = "Provide required datas"
                    setTimeout(() => {
                        document.getElementById("error_message").innerHTML = ""
                    }, 4000);
                }
                else if(result.failedSave){
                    document.getElementById("error_message").innerHTML = "Failed saving data...!"
                    setTimeout(() => {
                        document.getElementById("error_message").innerHTML = ""
                    }, 4000)
                }
                else if(noUser){
                    window.location.href = "/login"
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})

// FUNCTION FOR EDITING PROFILE
function editProfile(event, userId){
    event.stopPropagation()
    window.location.href = `/account/profile_Edit?userId=${userId}`
}


