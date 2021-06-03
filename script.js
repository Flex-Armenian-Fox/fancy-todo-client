'use strict'

const baseURL = 'http://localhost:3000'

$(document).ready(function() {

    checkAuth()
  
    $("#login-form").on("submit", (event) => {
        event.preventDefault()
        login()
    })

});

function checkAuth() {

    if (localStorage.getItem('accesstoken')) { // SUDAH login
        $("#login-section").hide()
        $("#main-nav").show()
        $("#drop-down-profile").show()

    } else if (!localStorage.getItem('accesstoken')) { // BELUM login
        $("#login-section").show()
        $("#main-nav").show()
        $("#drop-down-profile").hide()
        $("#drop-down-menu").hide()
    }
}

function login () {
    $.ajax({
        type: 'POST',
        url: baseURL + '/users/login',
        data: {
            email: $("#login-email").val(),
            password: $("#login-password").val()
        }
    })
        .done((response) => {
            console.log('MASUK DONE')
            // localStorage.setItem()
            console.log(response)
        })
        .fail((err) => {
            console.log('MASUK ERROR')
            let popError = `<div id="login-error" class="mt-2 text-center text-sm text-red-600">${err.responseJSON.message}</div>`
            $("#login-sub-section").append(popError)
            // console.log(xhr.responseJson)
            // console.log(status)
            console.log(err)
        })
        .always(_ => {
            $("#login-form").trigger('reset')
        })
}