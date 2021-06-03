let baseUrl = "http://localhost:3000";

$(document).ready(function(){
    auth();
    getCovidData();

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
        $("#navbar").show();
        $("#content-full").show();
    } else {
        $("#login").show();
    }
}

function registerAccount(){
    localStorage.removeItem("access_token");
    
    auth();
    $("#register").hide();
    $("submit").text("Register")

}

function login(){
    console.log(baseUrl)
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
        console.log(err)
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
        console.log(err)
    })
}