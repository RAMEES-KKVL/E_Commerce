//------------------------- EDIT BANNERS - CLIENT SIDE ---------------------------------

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

document.getElementById("banner_edit_button").addEventListener("click", async (event)=>{
    event.preventDefault()

    try {
        const bannerName = document.getElementById("bannerName").value.trim()
        const offerPrice = document.getElementById("offerPrice").value
        const bannerHeading = document.getElementById("bannerHeading").value.trim()
        const startingDate = document.getElementById("startingDate").value
        const endingDate = document.getElementById("endingDate").value
        const newImage = document.getElementById("bannerImage").files[0]
        
        if(!bannerName || !offerPrice || !bannerHeading || !startingDate || !endingDate ){
            document.getElementById("errorMessage").innerHTML = "Fill required datas"
           setTimeout(() => {
            document.getElementById("errorMessage").innerHTML = ""
            }, 4000);
        }else{
            const banner_id = document.getElementById("banner_edit_button").getAttribute("banner-id")
            const formData = new FormData(document.getElementById("banner_edit_form"))
            const bannerData = Object.fromEntries(formData)
            const response = await axios.patch(`/admin/banners/edit_banner?banner_id=${banner_id}`, bannerData, {
                headers : {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = response.data

            if(result.success){
                if(result.successnew){
                    document.getElementById("bannerName").innerHTML = bannerName
                    document.getElementById("offerPrice").innerHTML = offerPrice
                    document.getElementById("bannerHeading").innerHTML = bannerHeading
                    document.getElementById("startingDate").innerHTML = startingDate
                    document.getElementById("endingDate").innerHTML = endingDate

                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Coupon edited successfully",
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
                else if(result.oldimg){
                    document.getElementById("bannerName").innerHTML = bannerName
                    document.getElementById("offerPrice").innerHTML = offerPrice
                    document.getElementById("bannerHeading").innerHTML = bannerHeading
                    document.getElementById("startingDate").innerHTML = startingDate
                    document.getElementById("endingDate").innerHTML = endingDate

                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Banner updated successfully",
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            }else if(!result.success){
                if(!result.successnew){
                    document.getElementById("errorMessage").innerHTML = "Failed upadating banner...!"
                    setTimeout(() => {
                        document.getElementById("errorMessage").innerHTML = ""
                    }, 4000);
                }
                else if(!result.oldimg){
                    document.getElementById("errorMessage").innerHTML = "Failed upadating banner...!"
                    setTimeout(() => {
                        document.getElementById("errorMessage").innerHTML = ""
                    }, 4000);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})