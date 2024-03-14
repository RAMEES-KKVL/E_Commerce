// FUNCTION FOR DELETING PRODUCT FROM CHECKOUT PAGE 

async function deleteFromcheckout(event, producId){
    event.stopPropagation()
    try {
        const response = await axios.delete(`/checkout_delete?product_id=${producId}`)
        const result = response.data

        if(result.success){
            window.location.reload()
        }else{
            window.location.href = '/login'
        }            
    } catch (error) {
        console.log(error);
    }
}


// FUNCTION FOR DROPDOWN DIV FOR ADDING DELIVERY ADDRESS FROM CHECKOUT PAGE 

function dropDown(){
    const dropBtn = document.querySelector('.droup_right_btn')
    const plusIcon = document.querySelector('.plus_btn')
    const dropFrame = document.querySelector('.adrees_add_drop')
    dropBtn.addEventListener('click',()=>{
        if(plusIcon.classList.contains('bi-plus')){
            plusIcon.classList.replace('bi-plus','bi-dash-lg')
            dropFrame.style.bottom = '2rem'
        }
        else{
            plusIcon.classList.replace('bi-dash-lg','bi-plus')
            dropFrame.style.bottom = '27rem'
        }
    })
}


// FUNCTION FOR SELECTING PRODUCT QUANTITY FROM CHECKOUT PAGE

async function selectQuantity(event, productId){
    event.stopPropagation()

    document.querySelector(".quantity_count" + productId).addEventListener("change",async (element) => {
        try {
            element.preventDefault()
            const value = element.target.value
            const response = await axios.patch(`/checkout/updateQuantity?product_id=${productId}`,{value})
            const result = response.data

            if(result.success){
                window.location.reload()
            }
            else if(result.nocart){
                element.target.value = element.target.value
            }else(
                window.location.reload()
            )
        } catch (error) {
            console.log(error);
        }
    });   
}


// FUNCTION FOR SELECTING PRODUCT SIZE FROM CHECKOUT PAGE 

function selectSize(event, productId){
    event.stopPropagation()
    document.querySelector(".size_select" + productId).addEventListener("change", async (element)=>{
        try {
            element.preventDefault()
            const size = element.target.value
            const response = await axios.patch(`/checkout/updateSize?productId=${productId}`, {size})
            const result = response.data

            if(result.success){
                element.target.value = element.target.value
            }
            else if(result.nocart){
                element.target.value = element.target.value
            }else{
                element.target.value = element.target.value
            }
        } catch (error) {
            console.log(error);
        }

    })
}


// FUNCTION FOR APPLYING EXISTING COUPONS FROM CHECKOUT PAGE 

function applyCoupon(event, couponDiscount, couponName){
    document.querySelector(".coupon_price").innerHTML = couponDiscount
    document.querySelector(".order_total").innerHTML = Number(document.querySelector(".sub_total").innerHTML) - Number(couponDiscount)
    document.querySelector(".coupon_check_btn").textContent = 'REMOVE'
    document.getElementById("custom_coupon_name").value = couponName
}


// FUNCTION FOR ADDING REDEEMABLE EXTRA COUPONS FROM CHECKOUT PAGE

function customCoupon(){
    const userCoupon = document.getElementById("custom_coupon_name").value.trim()
    const orderTotal = document.querySelector(".order_total").innerHTML
    const coupons = JSON.parse(document.querySelector(".coupon_input_frame").getAttribute("coupons"))
    const couponsArray = []
    for(const key in coupons){
        couponsArray.push(coupons[key])
    }
    const couponExist = couponsArray.find(coupon => coupon.couponName == userCoupon)

    if(document.querySelector(".coupon_check_btn").innerHTML == 'SELECT'){
        if(couponExist){
            if(couponExist.availability == "LimitedUsers" && Number(orderTotal) >= couponExist.minOrderAmount && Number(orderTotal) <= couponExist.maxOrderAmount){
                document.querySelector(".coupon_price").innerHTML = couponExist.couponDiscount
                document.querySelector(".order_total").innerHTML = Number(orderTotal) - Number(couponExist.couponDiscount)
                document.querySelector(".coupon_check_btn").textContent = 'REMOVE'
            }else{
                document.getElementById("custom_coupon_name").value = "Couldn't apply coupon"
                setTimeout(() => {
                    document.getElementById("custom_coupon_name").value = ""
                }, 2500);
            }
        }else{
            document.getElementById("custom_coupon_name").value = "Coupon not available"
            setTimeout(() => {
                document.getElementById("custom_coupon_name").value = ""
            }, 2500);
        }
    }
    else if(document.querySelector(".coupon_check_btn").innerHTML == 'REMOVE'){
        document.querySelector(".order_total").innerHTML = Number(orderTotal) + Number(document.querySelector(".coupon_price").innerHTML)
        document.querySelector(".coupon_price").innerHTML = "Nill"
        document.querySelector(".coupon_check_btn").textContent = 'SELECT'
        document.getElementById("custom_coupon_name").value = ""
    }
}


// FUNCTION FOR ADDING ADDITIONAL DELIVERY ADDRESS FROM CHECKOUT PAGE 

async function addNewAddress(event){
    try {
        const phoneRegex = /^[0-9]{10}$/
        if(
            !document.getElementById("newFirstname").value.trim() ||
            !document.getElementById("newLastname").value.trim() ||
            !document.getElementById("newPhone").value ||
            !document.getElementById("newCountry").value.trim() ||
            !document.getElementById("newState").value.trim() ||
            !document.getElementById("newDistrict").value.trim() ||
            !document.getElementById("newPin").value ||
            !document.getElementById("newAddress").value.trim()
            ){
                document.getElementById("newError_message").innerHTML = "Provide required data"
                setTimeout(() => {
                    document.getElementById("newError_message").innerHTML = ""
                }, 4000);
            }else if(!phoneRegex.test(document.getElementById("newPhone").value)){
                document.getElementById("newError_message").innerHTML = "Mobile number not valid...!"
                setTimeout(() => {
                    document.getElementById("newError_message").innerHTML = ""
                }, 4000);
        }else{
            const formData = Object.fromEntries(new FormData(document.getElementById("adrress_form")))
            const response = await axios.post("/add_deliveryAddress", {formData})
            const result = response.data
            if(!result.success){
                if(result.noPush){
                    document.getElementById("newError_message").innerHTML = "Failed adding address"
                }
                else if(result.noSession){
                    window.location.href = "/login"
                }
                else if(result.noArray){
                    window.location.href = "/account"
                }
            }else{
                document.getElementById("adrress_form").reset()
                const addressList = document.querySelector(".checkouts_frame_bottom_adress")
                const newAddressDiv = document.createElement("div")
                newAddressDiv.classList.add("payment_divs", "select_adress_div")
                newAddressDiv.innerHTML = `
                    <input id="${formData.address}" class="delivery_adrress" name="delivery_Address" type="radio" value="${formData.address}">
                    <label for="add" style="overflow: auto;">${formData.address}</label>` 
                addressList.appendChild(newAddressDiv)
            }
        }
    } catch (error) {
        console.log(error);
    }
}


// FUNCTION FOR ORDERING PRODUCTS FROM CHECKOUT PAGE 

document.querySelector(".proceed_btn").addEventListener("click", async (event)=>{
    event.preventDefault()
        try {
            const paymentInputs = document.querySelectorAll('.payment_method')
            let selectedPaymentMethod
            paymentInputs.forEach(input =>{
                if(input.checked){
                    selectedPaymentMethod = input.id
                }
            })
            if(!selectedPaymentMethod){
                document.getElementById("error_payment").innerHTML = "Choose Payment Method"
                setTimeout(() => {
                    document.getElementById("error_payment").innerHTML = ""
                }, 2500);
            } 

            const addressInputs = document.querySelectorAll(".delivery_adrress")
            let selectedAddress 
            addressInputs.forEach(input =>{
                if(input.checked){
                    selectedAddress = input.id
                }
            })
            if(!selectedAddress){
                document.getElementById("error_address").innerHTML = "Choose address"
                setTimeout(() => {
                    document.getElementById("error_address").innerHTML = ""
                }, 2500);
            }
            
            const products = JSON.parse(document.querySelector(".checkout_left_top").getAttribute("checkout-Product"))
            const orderTotal = document.querySelector(".order_total").innerHTML.trim()
            const response = await axios.post(`/checkout`, {
                    paymentMethod: selectedPaymentMethod,
                    productArray: products,
                    delivery_Address: selectedAddress,
                    orderTotal
                }
            )
            const result = response.data

            if(result.success){
                if(result.COD){
                    window.location.href = "/cod_otp"
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
)