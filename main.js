let baseUrl = "http://localhost:3000";

$(document).ready(function(){
    auth();

    $('#register').click(e=> {
        e.preventDefault();
    
        registerAccount();
    })

    $("#login-form").submit(e => {
        e.preventDefault();
        // $(document).Toasts('create', {
        //     body: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr.',
        //     title: 'Toast Title',
        //     subtitle: 'Subtitle',
        //     icon: 'fas fa-envelope fa-lg',
        //   })

        console.log("XX")
        login();
    })

    $("#logout").click(e => {
        e.preventDefault();
        localStorage.removeItem("access_token")

        $("#inputEmail").val(""),
        $("#inputPassword").val(""),

        auth();
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
                        <input type="checkbox" value="" name="todo1" id="todoCheck${todo.id}">
                        <label for="todoCheck${todo.id}"></label>
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
                        <i class="fas fa-edit"></i>
                        <i class="fas fa-trash"></i>
                    </div>
                </li>
            `)
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