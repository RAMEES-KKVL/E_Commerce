// const { default: axios } = require("axios");

// FUNCTION FOR VIEWING PRODUCTS
function productView(event, productId){
    event.stopPropagation()
    window.location.href = `/product?product_id=${productId}`
}

// FUNCTION FOR CHANGING IMAGES WHEN CLICKED
function imageClicked(image){
    document.getElementById("product_image_img_view").src = `/uploads/product/${image}`
}

// FUNCTION FOR VIEWING NEXT IMAGE WHEN RIGHT ARROW CLICKED
function nextImage(imageArray){
    const imagerArray =JSON.parse(imageArray)
    const indx =  imagerArray.indexOf(document.getElementById("product_image_img_view").src.split("/").pop())
    if(indx != -1 && imagerArray[indx + 1] != undefined || null){
        document.getElementById("product_image_img_view").src = `/uploads/product/${imagerArray[indx + 1]}`
    }else{
        document.getElementById("product_image_img_view").src = `/uploads/product/${imagerArray[0]}`
    }
}

// FUNCTION FOR VIEWING PREVIOUS IMAGE WHEN LEFT ARROW CLICKED
function prevImage(Array){
    const imageArray =JSON.parse(Array)
    const indx =  imageArray.indexOf(document.getElementById("product_image_img_view").src.split("/").pop())
    if(indx != -1 && imageArray[indx - 1] != undefined || null){
        document.getElementById("product_image_img_view").src = `/uploads/product/${imageArray[indx - 1]}`
    }else{
        document.getElementById("product_image_img_view").src = `/uploads/product/${imageArray[imageArray.length - 1]}`
    }
}