const cl= console.log;

const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');
const addbtn = document.getElementById('addbtn');
const updatebtn = document.getElementById('updatebtn');
const spinner= document.getElementById('spinner')


const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`
const postContainer= document.getElementById('postContainer')


function tooltip(){
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
}

function snackbar(msg, icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}


function createPostsCards(arr){
    let result = '';
    arr.forEach(post =>{
result+= `<div class="col-md-3 mb-3" id="${post.id}">
        <div class="card h-100">
            <div class="card-header"  data-toggle="tooltip" data-placement="top" title="${post.title}">

                <h3>${post.title}</h3>
            </div>
            <div class="card-body">  <p> ${post.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button onClick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                <button onClick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button>

            </div>
           
        </div>



    </div>


`

    })
    postContainer.innerHTML= result;
    tooltip()

}

function fetchPost(){
spinner.classList.remove('d-none')
let xhr= new XMLHttpRequest()

xhr.open('GET', POST_URL, true)
xhr.send(null)

xhr.onload=function(){
    if(xhr.status >= 200 && xhr.status <= 299){
        let postsArr = JSON.parse(xhr.response)
        createPostsCards(postsArr)

spinner.classList.add('d-none')


    }else{
spinner.classList.add('d-none')


    }
}

}
fetchPost()

function onPostSubmit(eve){
    eve.preventDefault();

    let postObj={

        title: titleControl.value ,
        body: bodyControl.value ,
        userId: userIdControl.value ,
 }

//cl(postObj)

spinner.classList.add('d-none')


let xhr= new XMLHttpRequest()
xhr.open('POST', POST_URL, true)
xhr.send(postObj)

xhr.onload= function(){

    if(xhr.status >= 200 && xhr.status <=299){
        let res= JSON.parse(xhr.response)

        let col= document.createElement("div");
        col.className= "col-md-3 mb-3";
        col.id= res.id;
        col.innerHTML= ` <div class="card h-100">
            <div class="card-header"  data-toggle="tooltip" data-placement="top" title="${postObj.title}">
  
                <h3>${postObj.title}</h3>
            </div>
            <div class="card-body">  <p> ${postObj.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button class="btn btn-sm btn-primary">Edit</button>
                <button class="btn btn-sm btn-danger">Remove</button>

                </div>
           
        </div>`

        postContainer.prepend(col);
        tooltip()
        postForm.reset()

spinner.classList.add('d-none')


    }else{
spinner.classList.add('d-none')

    }

}
}

function onEdit(ele){
    let EDIT_ID= ele.closest('.col-md-3').id
    localStorage.setItem("EDIT_ID", EDIT_ID)
    let EDIT_URL= `${BASE_URL}/posts/${EDIT_ID}`


spinner.classList.add('d-none')

    let xhr= new XMLHttpRequest()
    xhr.open('GET', EDIT_URL)
    xhr.send(null)
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <=299){

            let EDIT_OBJ= JSON.parse(xhr.response)

            titleControl.value= EDIT_OBJ.title,
            bodyControl.value= EDIT_OBJ.body,
            userIdControl.value=EDIT_OBJ

            addbtn.classList.add('d-none')
            updatebtn.classList.remove('d-none')
spinner.classList.add('d-none')

postForm


        }else{

spinner.classList.add('d-none')

        }
    }

}

function onUpdate(){
    let UPDATE_ID = localStorage.getItem('EDIT_ID')
    localStorage.removeItem('EDIT_ID')

    let updateObj={ 
        title: titleControl.value ,
        body: bodyControl.value ,
        userId: userIdControl.value ,
        
    }

    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`
spinner.classList.remove('d-none')


    let xhr= new XMLHttpRequest()
    xhr.open('PATCH', UPDATE_URL)
    xhr.send(JSON.stringify(updateObj))
    xhr.onload=function(){
        if(xhr.status >= 200 && xhr.status <= 299){
let res= JSON.parse(xhr.response)
        let col= document.getElementById(UPDATE_ID)
      let h3 = col.querySelector(".card-header h3")
        let p = col.querySelector(".card-body p")

        h3.innerText= updateObj.title
        p.innerText = updateObj.body
        postForm.reset()

        addbtn.classList.remove('d-none')
        updatebtn.classList.add('d-none')
spinner.classList.add('d-none')

        }else{
spinner.classList.add('d-none')


        }
    }

}


function onRemove(ele){

Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let REMOVE_ID= ele.closest('.col-md-3').id
    let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`


spinner.classList.remove('d-none')
    

    let xhr= new XMLHttpRequest()
    xhr.open('DELETE', REMOVE_URL)
    xhr.send()
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            ele.closest('.col-md-3').remove()
        
        }
           

    spinner.classList.add('d-none')

    }
  }else{

  }


})

}






postForm.addEventListener("submit", onPostSubmit)
updatebtn.addEventListener('click', onUpdate)