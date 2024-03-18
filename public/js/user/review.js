//------------------------- PRODUCT REVIEW SECTION - CLIENT SIDE ---------------------------------

// FUNCTION FOR SELECTING STARS
let selectedStars
function starRating(ratingStars){
    selectedStars = parseInt(ratingStars)
    let starIcons
    const starIconsFilled = document.querySelectorAll(".bi-star-fill")
    if(starIconsFilled.length > 0){
        let length = starIconsFilled.length
        for(i = 0; i < length; i++){
            starIconsFilled[i].classList.replace("bi-star-fill","bi-star")
        }
        starIcons = document.querySelectorAll(".bi-star")
    }else{
        starIcons = document.querySelectorAll(".bi-star")
    }

    starIcons.forEach((starIcon, index)=>{
        if(index < ratingStars){
            starIcon.classList.replace("bi-star","bi-star-fill")
        }
    })
    document.querySelector(".review_frame").style.display = 'block'
    document.querySelector(".review_frame").style.height = '8rem'
}

// FUNCTION FOR SUBMITTING PRODUCT REVIEW 
async function reviewSubmit(event, productId){
    try {
        const productReview = document.querySelector(".review_textarea").value.trim()
        const response = await axios.post('/review_product', {productReview, selectedStars, productId})
        const result = response.data

        if(result.success){
            document.querySelector(".review_frame").style.display = 'none'
            document.querySelector(".review_div").style.pointerEvents = 'none'
        }else{
            if(result.missingData){
                document.getElementById("error_message").innerHTML = "Provide review"
                setTimeout(() => {
                    document.getElementById("error_message").innerHTML = ""
                }, 4000);
            }else if(result.failedSave){
                document.getElementById("error_message").innerHTML = "Couldn't save review"
                setTimeout(() => {
                    document.getElementById("error_message").innerHTML = ""
                }, 4000)
            }else if(result.reviewExist){
                document.getElementById("error_message").innerHTML = "Review already exists"
                setTimeout(() => {
                    document.getElementById("error_message").innerHTML = ""
                }, 4000)
            }
        }
    } catch (error) {
        console.log(error);
    }
}