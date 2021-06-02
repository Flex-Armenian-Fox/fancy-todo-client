const baseurl = "http://localhost:3000"

$(document).ready(function () {
    document.title = 'Todo Apps';

    checkLogin()

    $("#form-login").submit(function (e) { 
        e.preventDefault();
        login()
    });

    $("#nav-logout").on("click", function () {
        logout()
    });
});

function checkLogin() {
    if (localStorage.getItem("access_token")) {
        $("#navbar-section").show();
        $("#login-section").hide();
        $("#content-section").show();
        fetchData()
    } else {
        $("#navbar-section").hide();
        $("#login-section").show();
        $("#content-section").hide();
    }
}

function login() {
    const payload = {
        email: $("#email").val(),
        password: $("#password").val()
    };

    $.ajax({
        type: "POST",
        url: `${baseurl}/users/login`,
        data: payload
    })
    .done(response => {
        localStorage.setItem('access_token', response.access_token);
        checkLogin();
        $("#form-login").trigger("reset");
    })
    .fail(error => {
        console.log(error);
    });
}

function fetchData() {
    $.ajax({
        type: "GET",
        url: `${baseurl}/todos`,        
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done(response => {
        console.log("ni response dari server", response);
    })
    .fail(error => {
        console.log(error);
    })
}

function logout() {
    localStorage.clear()
    checkLogin()
}