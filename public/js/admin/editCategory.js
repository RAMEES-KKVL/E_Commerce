//------------------------- CATEGORY AND SUBCATEGORY EDITING - CLIENT SIDE ---------------------------------

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

// FUNCTION FOR SUBCATEGORY PREVIEW
function toggleDropdown() {
    const dropdown = document.getElementById("dropdownList");
    dropdown.style.display = dropdown.style.display ===  'none' ? 'block' : 'none'
}

// SUBCATEGORY EDITING SECTION
let subcategoryArray = JSON.parse(document.getElementById("dropdownList").getAttribute("sub-Category"))
document.getElementById("sub-category_submit_btn").addEventListener("click", async (event)=>{
    event.preventDefault()

    try {
        const subcategoryName = document.getElementById("subcategoryName").value.trim()
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
                document.getElementById("subcategoryName").value = ""
                updateSubcategoryList() 
            }
        } 
    } catch (error) {
        console.log(error);
    } 
})

function updateSubcategoryList(){
    const dropdownList = document.getElementById("dropdownList")
    dropdownList.innerHTML = ""

    subcategoryArray.forEach(subcategory =>{
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
    })
}

// CATEGORY EDITING SECTION
document.getElementById("category_edit_btn").addEventListener("click", async (event)=>{
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
        if(categoryName === ""){
            errormsg.innerHTML = "Provide Category name"
            setTimeout(() => {
                errormsg.innerHTML = ""
            }, 4000);
        }else{
            const category_id = document.getElementById("category_edit_btn").getAttribute("categoryId")
            const response = await axios.patch(`/admin/category/edit_Category?category_id=${category_id}`,categoryForm,{
                headers: {
                    "content-Type" : "multipart/form-data"
                }
            })
            const result = response.data

            if(result.success){
                if(result.allData){
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Category and subcategory updated successfully",
                        showConfirmButton: false,
                        timer: 2500
                      });
                }
                else if(result.data){
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
        console.log(error);
    }
})
