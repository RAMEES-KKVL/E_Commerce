
const sumbitbtn = document.querySelector('.login_submit')
const form = document.getElementById('loginForm')
const errorMessage = document.getElementById("loginError")

sumbitbtn.addEventListener("click", async (event)=>{

    event.preventDefault()

  const loginForm = new FormData(form)

    try {
        const response = await fetch("/login",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify(Object.fromEntries(loginForm))
        })

        if( !response.ok ){
            throw new Error("Login failed")

        }
        else{
            const result = await response.json()
    
            if(result.success){
                if(result.user){
                    window.location.href = "/home"
                }
                else if(result.otp){
                    const phone = result.phone
                    
                    window.location.href = `/otp/${phone}`
                }

            }
            else{
                errorMessage.innerHTML = result.error
            }
        }


    } catch (error) {
        console.log("login fetch ",error.message);
    }
})