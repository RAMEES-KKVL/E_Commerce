// const { default: axios } = require("axios");

function productView(event, productId){
    event.stopPropagation()
    window.location.href = `/product?product_id=${productId}`
}

function imageClicked(image){
    document.getElementById("product_image_img_view").src = `/uploads/product/${image}`
  }


function nextImage(imageArray){
    const imagerArray =JSON.parse(imageArray)
    const indx =  imagerArray.indexOf(document.getElementById("product_image_img_view").src.split("/").pop())
    if(indx != -1 && imagerArray[indx + 1] != undefined || null){
        document.getElementById("product_image_img_view").src = `/uploads/product/${imagerArray[indx + 1]}`
    }else{
        document.getElementById("product_image_img_view").src = `/uploads/product/${imagerArray[0]}`
    }
}


  function prevImage(Array){
    const imageArray =JSON.parse(Array)
    const indx =  imageArray.indexOf(document.getElementById("product_image_img_view").src.split("/").pop())
    if(indx != -1 && imageArray[indx - 1] != undefined || null){
        document.getElementById("product_image_img_view").src = `/uploads/product/${imageArray[indx - 1]}`
    }else{
        document.getElementById("product_image_img_view").src = `/uploads/product/${imageArray[imageArray.length - 1]}`
    }
  }