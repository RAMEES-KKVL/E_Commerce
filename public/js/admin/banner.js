//------------------------- BANNER ADDING - CLIENT SIDE ---------------------------------

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

// CONDUCTING CLIENT-SIDE VALIDATION AND PASSING DATA TO SERVER-SIDE AND GIVING RESPOSE
document.getElementById("banner_add_button").addEventListener("click", async (event)=>{
    event.preventDefault()
    try {
        const bannerName = document.getElementById("bannerName").value.trim()
        const bannerImage = document.getElementById("bannerImage").files[0]
        const bannerHeading = document.getElementById("bannerHeading").value.trim()
        const offerPrice = document.getElementById("offerPrice").value
        const startingDate = document.getElementById("startingDate").value
        const endingDate = document.getElementById("endingDate").value

        if(!bannerName || !bannerImage || !offerPrice || !bannerHeading || !startingDate || !endingDate){
            document.getElementById("errorMessage").innerHTML = "Please fill all fields"
            setTimeout(() => {
                document.getElementById("errorMessage").innerHTML = ""
            }, 4000);
        }else{
            const bannerData = new FormData(document.getElementById("banner_add_form"))
            const banner = Object.fromEntries(bannerData)
            const response = await axios.post("/admin/banners/add_banner", banner, {
                headers : {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = response.data

            if(!result.success){
                document.getElementById("errorMessage").innerHTML = "Banner already exists"
                setTimeout(() => {
                    document.getElementById("errorMessage").innerHTML = ""
                }, 4000);
            }else{
                document.getElementById("bannerName").value = ""
                document.getElementById("offerPrice").value = ""
                document.getElementById("bannerHeading").value = ""
                document.getElementById("startingDate").value = ""
                document.getElementById("endingDate").value = ""
                document.getElementById("imagePreview").src = ""

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Banner added successfully",
                    showConfirmButton: false,
                    timer: 2500
                  });
            }
        }
    } catch (error) {
        console.log(error);
    }
})