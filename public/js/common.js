// const { default: axios } = require("axios");

function productView(event, productId){
    event.stopPropagation()
    window.location.href = `/product?product_id=${productId}`
}

