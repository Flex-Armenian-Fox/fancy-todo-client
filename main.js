// let dateFormat = require('dateformat') ;
// import dateFormat from 'dateformat'
let baseUrl = "http://localhost:3000";

$(document).ready(function(){
    auth();

    $('#register').click(e=> {
        e.preventDefault();
    
        registerAccount();
    })

    $("#login-form").submit(e => {
        e.preventDefault();
        login();
    })

    $("#logout").click(e => {
        e.preventDefault();
        localStorage.removeItem("access_token")

        $("#inputEmail").val(""),
        $("#inputPassword").val(""),

        auth();
    })

    $("#new-todo").click(e => {
        e.preventDefault();
        showTodoForm(true);
    })

    $("#cancel-button").click(e => {
        e.preventDefault();
        standbyPage()
    })
})

function auth(){
    $("#navbar").hide();
    $("#todos-form").hide();
    $("#login").hide();
    $("#content-full").hide();

    if (localStorage.getItem("access_token")) {
        getCovidData();
        getTodosList();

        $("#navbar").show();
        $("#content-full").show();
    } else {
        $("#inputEmail").val(""),
        $("#inputPassword").val(""),

        $("#submit").text("Sign In")
        $("#label-login").text("Sign in to start your session")
        $("#register").show();
        $("#login").show();
    }
}

function registerAccount(){
    localStorage.removeItem("access_token");
    
    auth();
    $("#register").hide();
    $("#submit").text("Register")
    $("#label-login").text("New User Account")

}

function login(){
    console.log(baseUrl)

    if ($("#submit").text() == "Register") {
        $.ajax({
            type: "POST",
            url: baseUrl + "/users",
            data: {
                email: $("#inputEmail").val(),
                password: $("#inputPassword").val(),
            }
        })
        .done(res => {
            swal("Register Success", "Please Login", "success");
            auth();
        })
        .fail(err => {
            swal(err.responseJSON.message, "", "warning");
            console.log(err.responseJSON.message)
        })
    } else {
        $.ajax({
            type: "POST",
            url: baseUrl + "/users/login",
            data: {
                email: $("#inputEmail").val(),
                password: $("#inputPassword").val(),
            }
        })
        .done(res => {
            console.log("--->", res)
            localStorage.setItem("access_token", res.access_token)
            auth();
        })
        .fail(err => {
            // console.log(err)
            swal(err.responseJSON.message, "", "warning");
        })
    }
}

function getTodosList() {
    $.ajax({
        type: "GET",
        url: baseUrl + "/todos",
        headers: { access_token : localStorage.getItem("access_token")}
    })
    .done(res => {
        $("#list-todos").empty();

        console.log(res[0].title)
        res.forEach(todo => {
            $("#list-todos").append(`
                <li>
                    <!-- checkbox -->
                    <div class="icheck-primary d-inline ml-2">
                        <input type="checkbox" value="Done" name="todo${todo.id}" id="todoCheck${todo.id}">
                        <label for="todoCheck${todo.id}" onclick="updateStatus(${todo.id})"></label>
                    </div>
                    <!-- todo text -->
                    <span class="text">
                        <h4>${todo.title}</h4>
                        <p>
                            ${todo.description}<br>
                            Due Date : ${todo.due_date}
                        </p>
                    </span>

                    <div class="tools">
                        <i class="fas fa-edit" onClick="showTodoForm(false, ${todo.id})"></i>
                        <i class="fas fa-trash" onClick="deleteTodo(${todo.id})"></i>
                    </div>
                </li>
            `)

            if (todo.status == "Done") {
                $("#todoCheck" + todo.id).prop('checked', true)
            } else {
                $("#todoCheck" + todo.id).prop('checked', false)
            }
        });
        // res.foreach(todo => {
        //     $("#list-todos").append(`
        //     <li>
        //         <!-- checkbox -->
        //         <div class="icheck-primary d-inline ml-2">
        //             <input type="checkbox" value="" name="todo1" id="todoCheck1">
        //             <label for="todoCheck1"></label>
        //         </div>
        //         <!-- todo text -->
        //         <span class="text">
        //             <h4>${todo.title}</h4>
        //             <p>${todo.description}</p>
        //         </span>

        //         <div class="tools">
        //             <i class="fas fa-edit"></i>
        //             <i class="fas fa-trash"></i>
        //         </div>
        //     </li>
        // `)
    })
    .fail(err => {
        swal(err.responseJSON.message, "", "warning");
    })
}

function getCovidData(){
    $.ajax({
        type: "GET",
        url: baseUrl + "/covid",
    })
    .done(res => {
        // console.log("DATA ==>> ", res.data["Active Cases_text"])
        $("#active-cases").empty();
        $("#new-cases").empty();
        $("#total-cases").empty();
        $("#death-cases").empty();

        $("#active-cases").append(`
            <h3>${res.data["Active Cases_text"]}</h3>
            <p>Active Covid Cases <br>
            Updated : ${res.data["Last Update"]}
            </p>
        `);

        $("#new-cases").append(`
            <h3>${res.data["New Cases_text"]}</h3>
            <p>New Covid Cases <br>
            Updated : ${res.data["Last Update"]}
            </p>
        `);

        $("#total-cases").append(`
            <h3>${res.data["Total Cases_text"]}</h3>
            <p>Total Covid Cases <br>
            Updated : ${res.data["Last Update"]}
            </p>
        `);

        $("#death-cases").append(`
            <h3>${res.data["Total Deaths_text"]}</h3>
            <p>Total Covid Death Cases <br>
            Updated : ${res.data["Last Update"]}
            </p>
        `);
    })
    .fail(err => {
        swal(err.responseJSON.message, "", "warning");
    })
}

function showTodoForm(isNew, id) {
    $("#navbar").show();
    $("#todos-form").show();
    $("#login").hide();
    $("#content-full").hide();   
    $("#card-title").text("Add New Data");

    if (isNew == false){
        $("#card-title").text("Edit Data");
        $.ajax({
            type: "GET",
            url: baseUrl + "/todos/" + id,
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
        .done(res => {
            $("#inputTitle").val(res.title)
            $("#inputDescription").val(res.description)
            $("#inputDueDate").val(res.due_date.slice(0, 10))
        })
        .fail(err => {
            swal(err.responseJSON.message, "", "warning");
            console.log(err.responseJSON.message)
        })    
    }

    $("#todos-form").submit(e => {
        e.preventDefault();

        saveTodo(isNew?0:id);
    })
}

function saveTodo(id){
    console.log("XXXXX", id)
    if (id == 0){
        $.ajax({
            type: "POST",
            url: baseUrl + "/todos",
            data: {
                title: $("#inputTitle").val(),
                description: $("#inputDescription").val(),
                status: "Undone",
                due_date: $("#inputDueDate").val(),
            },
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
        .done(res => {
            swal("Todo Add Success", "", "success");
            
            standbyPage();
        })
        .fail(err => {
            swal(err.responseJSON.message, "", "warning");
            console.log(err.responseJSON.message)
        })
    } else {
        $.ajax({
            type: "PUT",
            url: baseUrl + "/todos/" + id,
            data: {
                title: $("#inputTitle").val(),
                description: $("#inputDescription").val(),
                due_date: $("#inputDueDate").val(),
            },
            headers: {
                access_token: localStorage.getItem("access_token")
            }
        })
        .done(res => {
            swal("Todo Update Success", "", "success");
            
            standbyPage();
        })
        .fail(err => {
            swal(err.responseJSON.message, "", "warning");
            console.log(err.responseJSON.message)
        })
    }
    
}

function standbyPage(){
    getTodosList();
    $("#navbar").show();
    $("#todos-form").hide();
    $("#login").hide();
    $("#content-full").show();   
}

function deleteTodo(id) {
    $.ajax({
        type: "DELETE",
        url: baseUrl + "/todos/" + id,
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done(res => {
        swal("Todo Delete Success", "", "success");
        
        standbyPage();
    })
    .fail(err => {
        swal(err.responseJSON.message, "", "warning");
        console.log(err.responseJSON.message)
    })   
}

function updateStatus(id){
    let setStatus = "";
    if ($("#todoCheck" + id).prop('checked') == true){
        setStatus = "Undone"
    } else {
        setStatus = "Done"
    }

    $.ajax({
        type: "PATCH",
        url: baseUrl + "/todos/" + id,
        data: {
            status: setStatus
        },
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .fail(err => {
        swal(err.responseJSON.message, "", "warning");
        console.log(err.responseJSON.message)
    })   

    // console.log(id, $("#todoCheck" + id).val(), $("#todoCheck" + id).prop('checked'))
}