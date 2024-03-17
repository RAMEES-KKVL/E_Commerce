//------------------------- CATEGORY AND SUBCATEGORY ADDING - CLIENT SIDE ---------------------------------

// const { default: axios } = require("axios")
// const Content = require("twilio/lib/rest/Content")

let subcategoryArray = []

// FUNCTION FOR SUBCATEGORY PREVIEW
function toggleDropdown() {
    const dropdown = document.getElementById("dropdownList");
    dropdown.style.display = dropdown.style.display ===  'none' ? 'block' : 'none'
}

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

// SUBCATEGORY ADDING SECTION
const categoryBtn = document.getElementById("category_submit_btn")
const subcategoryBtn = document.getElementById("sub-category_submit_btn")
subcategoryBtn.addEventListener("click", async (event)=>{
    event.preventDefault()
   try {
      const subcategoryNameInput = document.getElementById("subcategoryName")
      const subcategoryName = subcategoryNameInput.value.trim()
      const subcatError = document.getElementById("subcatError")
      
        if(subcategoryName === ""){
            subcatError.innerHTML = "Provide Subcategory name"
            setTimeout(() => {
                subcatError.innerHTML = ""
                }, 4000);
        }else{
            const exist = subcategoryArray.find((val)=> val === subcategoryName )
            if(exist){
                subcatError.innerHTML = "Subcategory already exist"
                setTimeout(() => {
                    subcatError.innerHTML = ""
                    }, 4000);
            }else{
                subcategoryArray.push(subcategoryName)
                subcategoryNameInput.value = ""
                updateSubcategoryList(subcategoryArray) 
            }
        } 
   } catch (error) {
    console.log("subCategory ",error);
   } 
})

function updateSubcategoryList(){
    const dropdownList = document.getElementById("dropdownList")
    dropdownList.innerHTML = ""
    
    subcategoryArray.forEach(subcategory => {
        const listItem = document.createElement("li")
        listItem.classList.add('ul_li')
        listItem.innerHTML = subcategory + `<i  class="bi delete${subcategory} bi-trash-fill"></i>`
        dropdownList.appendChild(listItem)
        const deleteIcons = document.querySelectorAll(`.delete${subcategory}`);
        deleteIcons.forEach(deleteIcon => {
            deleteIcon.addEventListener('click', () => {
                const index = subcategoryArray.indexOf(subcategory);
                if (index !== -1) {
                    subcategoryArray.splice(index, 1);
                    updateSubcategoryList();
                }
            });
        });
    });
}

// FUNCTION FOR ADDING CATEGORY
categoryBtn.addEventListener("click", async (event)=>{
    event.preventDefault()
    const categoryImage = document.getElementById("categoryImage").files[0]
    const categoryName = document.getElementById("categoryName").value.trim()
    let subcategoryName = document.getElementById("subcategoryName").value.trim()
    if(subcategoryName){
        const exist = subcategoryArray.find((val)=> val === subcategoryName)
        if(!exist){
            subcategoryArray.push(subcategoryName)
        }
        else{
            subcategoryName = ''
        }
    }
    const categoryForm = new FormData()
    categoryForm.append("categoryImage",categoryImage)
    categoryForm.append("category",categoryName)
    categoryForm.append("subCategory",JSON.stringify(subcategoryArray))
    const errormsg = document.getElementById("errorMessage")
    try {
        if(categoryName === "" && !categoryImage){
            errormsg.innerHTML = "Provide Category details"
            setTimeout(() => {
                errormsg.innerHTML = ""
            }, 4000);
        }
        else if(categoryName === ""){
            errormsg.innerHTML = "Provide Category name"
            setTimeout(() => {
                errormsg.innerHTML = ""
            }, 4000);
        }
        else if(!categoryImage){
            errormsg.innerHTML = "Provide Category image"
            setTimeout(() => {
                errormsg.innerHTML = ""
            }, 4000);
        }else{
            const response = await axios.post("/admin/category/add_Category",categoryForm,{
                headers: {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = response.data
            const categoryInput = document.getElementById("categoryName")
            const subcategoryNameInput = document.getElementById("subcategoryName")
            const imageInput = document.getElementById("imagePreview")

            if(result.success){
                if(result.allData){
                    categoryInput.value = ""
                    subcategoryNameInput.value = ""
                    imageInput.src = ""
                    subcategoryArray = []
                    dropdownList.innerHTML = ""
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Category and subcategory updated successfully",
                        showConfirmButton: false,
                        timer: 2500
                        });
                }
                else if(result.data){
                    categoryInput.value = ""
                    imageInput.src = ""
                    subcategoryNameInput.value = ""
                    subcategoryArray = []
                    dropdownList.innerHTML = ""
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Category updated successfully",
                        showConfirmButton: false,
                        timer: 2500
                    });
                }
            }else{
                if(result.missingData){
                    errormsg.innerHTML = result.errorMsg
                    setTimeout(() => {
                        errormsg.innerHTML = ""
                    }, 4000);
                }
                else if(result.exist){
                    errormsg.innerHTML = result.errorMsg
                    setTimeout(() => {
                        errormsg.innerHTML = ""
                    }, 4000);
                }
            }
        }
    } catch (error) {
        console.log("category fetch ",error.message);
    }
})

























