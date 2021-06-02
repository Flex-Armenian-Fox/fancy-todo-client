const defaultHost = "localhost:3000"

$(document).ready(() => {
    console.log("masuk")
    auth()

    $("#login-panel").submit(e => {
        e.preventDefault()
        login()
    })
})

const auth = () =>{
    if (localStorage.access_key) {
        $("#login-panel").hide()
        $("#todo-list").show()
    } else {
        $("#login-panel").show()
        $("#todo-list").hide()
    }
}

const login = () =>{
    $.ajax({
          url: defaultHost + "/users/login",
          method: 'POST',
          data: {
              email: $("#login-email"),
              password: $("#login-password")
          }
        })
        .done(res =>{
            console.log(res)
        })
        .fail(err =>{
            console.log(err)
        })
}