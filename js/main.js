const SERVER = "http://localhost:3000"

$(document).ready(() => {
    console.log("masuk")
    auth()
})

const auth = () =>{
    $(".def-hid").hide()
    $(".def-show").show()
    let today = new Date()
    today = today.toISOString().slice(0, 10)
    $("#form-date").val(today)
    $(`#user-form`).off().on('submit', (e) => {
        e.preventDefault()
        login()
    })
    $(`#todo-form`).off().on('submit', (e) => {
        e.preventDefault()
        postTodo()
    })
    if (localStorage.access_token) {
        $("#user-form").hide()
        getTodos()
        $("#timeline-container").show()
        $("#logout-btn").show()

    } else {
        $("#user-form").show()
        $("#timeline-container").hide()
        $("#logout-btn").hide()
        $("#user-submit").text("Login")
        $("#user-form-title").text("LOGIN")
    }
}

const login = () =>{
    $.ajax({
          url: SERVER + "/users/login/",
          method: "POST",
          data: {
              email: $("#login-email").val(),
              password: $("#login-password").val()
          }
        })
        .done(res =>{
            console.log("sukses")
            localStorage.access_token = res.access_token
            $("#login-email").val("")
            $("#login-password").val("")
            auth()
        })
        .fail(err =>{
            let {message} = JSON.parse(err.responseText)
            $(`#user-err`).text(message)
            $(`#user-err`).show()
        })
}

const getTodos = () =>{
    $(`#todo-list`).empty()
    $.ajax({
        type: "GET",
        url: SERVER + "/todos",
        headers: {access_token: localStorage.access_token}
    }) .done(res => {
        console.log(res)
        res.data.forEach(el =>{
            let dueDate = new Date(el.due_date)
            dueDate = dueDate.toDateString()
            let notPending = (el.status != "Pending")? "not-pending":""
            let background = (el.status != "Pending")? "tm-bg-dark" : "tm-bg-dark-red"
            $("#todo-list").append(`
            <div class="tm-timeline-item ${notPending}" id="timeline-item-${el.id}">
                <div class="tm-timeline-item-inner">
                    <div class="container tm-img-timeline rounded-circle text-centered tm-bg-dark-light">
                        <div style="margin-top: 45px; text-align:center" class="text-centered">
                            <h1 class="tm-site-title">${daysLeft(el.due_date)}</h1><br>
                            <p>Days Left</p>
                            <h1>
                        </div>
                    </div>
                    <div class="tm-timeline-connector">
                        <p class="mb-0">&nbsp;</p>
                    </div>
                    <div class="tm-timeline-description-wrap" style="width:70%">
                        <div class="${background} tm-timeline-description" style="width:90%" id="todo-container-${el.id}">
                            <h3 class="tm-text-green tm-font-400">${el.title}</h3>
                            <p>${el.description || ""}</p>
                            <p class="tm-text-gray float-right mb-0">Deadline: ${dueDate}</p> <br><br>

                            <select class="float-right mb-0" id="todo-${el.id}-status" onchange="postPatch(${el.id})">
                                <option value="${el.status}" selected hidden>${el.status}</option>
                                <option value="Pending">Pending</option>
                                <option value="Done">Done</option>
                                <option value="Postponed">Postponed</option>
                            </select> <br> <br>
                            <button class="btn btn-info float-right" onClick="editForm(${el.id})">edit</button> <button class="btn btn-danger float-right" onClick="delTodo(${el.id})">Delete</button> 
                        </div>
                    </div>
                </div>
                <div class="tm-timeline-connector-vertical"></div>
            </div> 
            `);
        })
        console.log(res)
    }) .fail(err => {
        console.log(err)
    })
}

const delTodo = (id) => {
    $.ajax({
        type: "DELETE",
        url: SERVER + `/todos/${id}`,
        headers:{
            access_token: localStorage.access_token
        }
    }) .done(res =>{
        auth()
    }) .fail(err =>{
        console.log(err)
    })
}

const postTodo = () =>{
    console.log("test")
    $.ajax({
        type: "POST",
        url: SERVER + "/todos/",
        data: {
            "title": $(`#form-title`).val(),
            "description": $(`#form-desc`).val() || "",
            "status" : $(`#form-stat`).val(),
            "due_date": $(`#form-date`).val()
        },
        headers:{
            access_token: localStorage.access_token
        }
    }) .done(res => {
        auth()
    }).fail(err => {
        let {message} = JSON.parse(err.responseText)
        message = message.join(`, `)
        $(`#todo-err`).text(message)
        $(`#todo-err`).show()
    })
}

const editForm = (id) =>  {
    console.log("masuk")
    $("#todo-form-container").show()
    $("#timeline-container").hide()
    $("#post-btn").hide()
    $("#edit-btn").show()
    $(`#form-type`).text("Edit Todos")
    $(`#todo-form`).off().on('submit', () => {postEdit(id)})
    $.ajax({
        type: "GET",
        url: SERVER + `/todos/${id}`,
        headers:{
            access_token: localStorage.access_token
        }
    }) .done(res =>{
        console.log(res.due_date)
        let dueDate = new Date(res.due_date)
        dueDate = dueDate.toISOString().slice(0,10)
        $(`#form-title`).val(res.title)
        $(`#form-desc`).val(res.description)
        $(`#form-stat`).val(res.status)
        $(`#form-date`).val(dueDate)

    }) .fail(err =>{
        console.log(err)
    })
}

const postEdit = (id) => {
    console.log(`post edit`)
    $.ajax({
        type: "PUT",
        url: SERVER + `/todos/${id}`,
        data: {
            "title": $(`#form-title`).val(),
            "description": $(`#form-desc`).val(),
            "status" : $(`#form-stat`).val(),
            "due_date": $(`#form-date`).val()
        },
        headers:{
            access_token: localStorage.access_token
        }
    }) .done(res => {
        auth()
    }).fail(err => {
        let {message} = JSON.parse(err.responseText)
        message = message.join(`, `)
        $(`#todo-err`).text(message)
        $(`#todo-err`).show()
    })
}

const registerForm = () =>{
    $(`#user-err`).empty()
    $(`#user-form-title`).text("REGISTER")
    $(`#user-submit`).text("Register")
    $(`#not-register`).hide()
    $(`#register-back`).show()
    $(`#reg-btn`).show()
    $(`#login-btn`).hide()
    $(`#user-form`).off('submit').on('submit', () => {postRegister})
}

const postRegister = () =>{
    $.ajax({
        url: SERVER + "/users/register/",
        method: "POST",
        data: {
            email: $("#login-email").val(),
            password: $("#login-password").val()
        }
      })
      .done(res =>{
          console.log("sukses")
          auth()
      })
      .fail(err =>{
        console.log("fail")
        let {message} = JSON.parse(err.responseText)
        $(`#user-err`).text(message)
        $(`#user-err`).show()
    })
}

const postPatch = (id) =>{
    if($(`#todo-${id}-status`).val() == "Pending") {
        $(`#todo-container-${id}`).removeClass("tm-bg-dark").addClass("tm-bg-dark-red")
        $(`#timeline-item-${id}`).removeClass("not-pending")
    } else{
        $(`#todo-container-${id}`).removeClass("tm-bg-dark-red").addClass("tm-bg-dark")
        $(`#timeline-item-${id}`).addClass("not-pending")
    }
    $.ajax({
        type: "PATCH",
        url: SERVER + `/todos/${id}`,
        data: {
            "status" : $(`#todo-${id}-status`).val()
        },
        headers:{
            access_token: localStorage.access_token
        }
    }) .done(res => {
        displayToggle()
    }) .fail(err => {
        console.log(err)
    })
}

const logout = () =>{
    localStorage.removeItem("access_token");
    auth();
}

const daysLeft = (date) => {  
    let today = new Date((new Date()).toISOString().slice(0,10)).getTime()
    let dateOnly = new Date(date);
    dateOnly = dateOnly.getTime()
    let calc = (dateOnly - today) / (1000*60*60*24)
    calc = Math.round(calc)
    return calc
}

const pendingToggle = () =>{
    if($("#pending-toggle").text() == "Show Pending") {
        $("#pending-toggle").text("Show All")
    } else {
        $("#pending-toggle").text("Show Pending")
    }
    displayToggle()
}

const displayToggle = () => {
    if($("#pending-toggle").text() == "Show Pending") $(".not-pending").show()
    else $(".not-pending").hide()
}

const getAdd = () =>{
    $("#todo-form-container").show()
    $("#timeline-container").hide()
    $("#form-type").text("Add Todos")
}