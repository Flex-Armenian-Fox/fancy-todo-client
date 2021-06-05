'use strict'

const baseURL = 'http://localhost:3000'

$(document).ready(function() {

    checkAuth()
  
    // LOG-IN FORM
    $("#login-form").on("submit", (event) => {
        event.preventDefault()
        login()
    })

    // REGISTER FORM
    $("#register-form").on("submit", (event) => {
        event.preventDefault()
        register()
    })

    // ADD NEW TODO FORM
    $("#add-new-todo").on("click", (event) => {
        event.preventDefault()
        $("#main-todo-list").hide()
        $("#create-todo-section").show()
        $("#create-todo-form").trigger('reset')
    })

    // LOG-OUT LINK
    $("#sign-out").on("click", (event) => {
        logout()
    })

    // REGISTER LINK
    $("#register-link").on("click", (event) => {
        $("#register-error").remove()
        $("#login-section").hide()
        $("#register-section").show()
    })

    // LOG-IN LINK
    $("#login-link").on("click", (event) => {
        $("#login-error").remove()
        $("#register-success").remove()
        $("#login-section").show()
        $("#register-section").hide()
    })

    // CANCEL – ADD TODO
    $("#add-todo-cancel").on("click", (event) => {
        checkAuth()
    })

    // SAVE – ADD TODO
    $("#add-todo-submit").on("click", (event) => {
        event.preventDefault()
        addNew()
    })

    // CANCEL - EDIT TODO
    $("#edit-todo-cancel").on("click", (event) => {
        checkAuth()
    })

});

function checkAuth() {

    if (localStorage.getItem('accesstoken')) { // SUDAH login
        $("#login-section").hide()
        $("#register-section").hide()
        $("#main-nav").show()
        $("#nav-landing").hide()
        $("#nav-signedin").show()
        $("#main-todo-list").show()
        $("#create-todo-section").hide()
        $("#edit-todo-section").hide()

        getTodos()

    } else if (!localStorage.getItem('accesstoken')) { // BELUM login
        $("#login-section").show()
        $("#register-section").hide()
        $("#main-nav").show()
        $("#nav-signedin").hide()
        $("#nav-landing").show()
        $("#main-todo-list").hide()
        $("#create-todo-section").hide()
        $("#edit-todo-section").hide()
    }

}

function getTodos () {
    $.ajax({
        type: 'GET',
        url: baseURL + '/todos',
        headers: {accesstoken: localStorage.getItem('accesstoken')}
    })
        .done((response) => {
            console.log('MASUK getTodos-DONE')
            console.log('response ==>', response)
            $("#main-table-todo-body").empty()
            if (response.length > 0) {

                for (let i = 0; i < response.length; i++) {
                    let todoSyntax = `
                    <tr>
                      <td id="todo-${response[i].id}" class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">
                            ${response[i].title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-500">${response[i].description}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">`

                      switch (response[i].status) {
                          case 'ongoing':
                            todoSyntax += `
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                            ${response[i].status}
                            </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${refinedDate(response[i].due_date)}
                            </td>
      
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" id="todo-edit-${response[i].id}" onClick='editForm(${response[i].id})' class="text-indigo-600 hover:text-indigo-900">Edit</a>
                            </td>
      
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" id="todo-done-${response[i].id}" class="text-green-600 hover:text-green-900">Mark Done</a>
                            </td>`
                            break

                          case 'completed':
                            todoSyntax += `
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${response[i].status}
                            </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${refinedDate(response[i].due_date)}
                            </td>
      
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" id="todo-edit-${response[i].id}" onClick='editForm(${response[i].id})' class="text-indigo-600 hover:text-indigo-900">Edit</a>
                            </td>
      
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" id="todo-ongoing-${response[i].id}" class="text-gray-600 hover:text-gray-900">Mark Ongoing</a>
                            </td>`
                            break

                          case 'overdue':
                            todoSyntax += `
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            ${response[i].status}
                            </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${refinedDate(response[i].due_date)}
                            </td>
      
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" id="todo-edit-${response[i].id}" onClick='editForm(${response[i].id})' class="text-indigo-600 hover:text-indigo-900">Edit</a>
                            </td>
      
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" id="todo-done-${response[i].id}" class="text-green-600 hover:text-green-900">Mark Done</a>
                            </td>`
                            break
                      }

                    todoSyntax += `

                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" id="todo-delete-${response[i].id}" onclick='remove(${response[i].id})' class="text-red-600 hover:text-red-900">Delete</a>
                      </td>

                    </tr>`

                    $("#main-table-todo-body").append(todoSyntax)
                }
            }
        })
        .fail((err) => {
            console.log('MASUK getTodos-ERROR')
            console.log('err ==>', err)
        })
        .always(() => {
            console.log('MASUK getTodos-ALWAYS')
        })
}

function editForm(todoId) {

    $.ajax({
        type: 'GET',
        url: baseURL + '/todos/' + todoId,
        headers: {accesstoken: localStorage.getItem('accesstoken')}
    })
        .done(response => {
            console.log('MASUK editForm-DONE')
            console.log(response)

            $("#main-todo-list").hide()
            $("#edit-todo-section").empty()
            let editSyntax = `
            <div class="hidden sm:block" aria-hidden="true">
                <div class="py-5">
                <div class="border-t border-gray-200"></div>
                </div>
            </div>
            
            <div class="mt-10 sm:mt-0">
                <div class="md:grid md:grid-cols-3 md:gap-6">
                <div class="md:col-span-1">
                    <div id="edit-todo-sidebar" class="px-4 sm:px-0">
                      <h3 class="text-lg font-medium leading-6 text-gray-900">Edit Todo</h3>
                      <p class="mt-1 text-sm text-gray-600">
                          Your edited todo will be displayed once you click 'Save'.
                      </p>
                    </div>
                </div>
                <div class="mt-5 md:mt-0 md:col-span-2">
                    <form action="#" id="edit-todo-form" method="POST">
                    <div class="shadow overflow-hidden sm:rounded-md">
                        <div class="px-4 py-5 bg-white sm:p-6">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-7 sm:col-span-4">
                            <label for="edit-todo-title" class="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value="${response.todo.title}" name="edit-todo-title" id="edit-todo-title" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>
            
                            <div class="col-span-7 sm:col-span-4">
                            <label for="edit-todo-description" class="block text-sm font-medium text-gray-700">Description</label>
                            <input type="text" value="${response.todo.description}" name="edit-todo-description" id="edit-todo-description" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                            </div>`

            if (response.todo.status === 'ongoing') {
                editSyntax += `
                <div class="col-span-6 sm:col-span-3">
                    <label for="edit-todo-status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select id="edit-todo-status" name="edit-todo-status" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option selected value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                `
            } else if (response.todo.status === 'completed') {
                editSyntax += `
                <div class="col-span-6 sm:col-span-3">
                    <label for="edit-todo-status" class="block text-sm font-medium text-gray-700">Status</label>
                    <select id="edit-todo-status" name="edit-todo-status" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="ongoing">Ongoing</option>
                        <option selected value="completed">Completed</option>
                    </select>
                </div>
                `
            }

            editSyntax += `
            <div class="col-span-6 sm:col-span-3 lg:col-span-2">
                <label for="edit-todo-due-date" class="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" value="${(response.todo.due_date).substring(0, 10)}" name="edit-todo-due-date" id="edit-todo-due-date" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                </div>
            </div>
            </div>

                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button type="button" id="edit-todo-cancel" onClick='checkAuth()' class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                </button>
                <button type="button" id="edit-todo-submit" onClick='postEdit(${response.todo.id})' class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Save Edits
                </button>
                </div>
                </div>
                </form>
            </div>
            </div>
            </div>
            
            <div class="hidden sm:block" aria-hidden="true">
                <div class="py-5">
                <div class="border-t border-gray-200"></div>
                </div>
            </div>`
            $("#edit-todo-section").append(editSyntax)
            $("#edit-todo-section").show()

        })
        .fail(err => {
            console.log('MASUK editForm-ERROR')
            console.log(err)
        })
        .always(() => {
            console.log('MASUK editForm-ALWAYS')
        })
}

function postEdit(todoId) {
    const editData = {
        title: $("#edit-todo-title").val(),
        description: $("#edit-todo-description").val(),
        status: $("#edit-todo-status").val(),
        due_date: $("#edit-todo-due-date").val()
    }

    $.ajax({
        type: 'PUT',
        url: baseURL + '/todos/' + todoId,
        data: editData,
        headers: {accesstoken: localStorage.getItem('accesstoken')}
    })
        .done(response => {
            console.log('MASUK postEdit-DONE')
            console.log(response)
            
            checkAuth()
        })
        .fail(err => {
            console.log('MASUK postEdit-ERROR')
            console.log(err)
        })
        .always(() => {
            console.log('MASUK postEdit-ALWAYS')
        })
}

function refinedDate(systemDate) {
    
    let rawDate = new Date (systemDate)
    let dateString = rawDate.toDateString()
    let splitString = dateString.split(' ')
    let result = ''

    for (let i = 0; i < splitString.length; i++) {
        result += splitString[i]
        if (i === 0 || i === 2) {
            result += ','
        }
        if (i !== splitString.length-1) {
            result += ' '
        }
    }
    
    return result
    
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
            console.log('MASUK Login-DONE')
            localStorage.setItem('accesstoken', response.accesstoken)
            checkAuth()
        })
        .fail((err) => {
            console.log('MASUK Login-ERROR')
            $("#login-error").remove()
            $("#register-success").remove()
            let loginError = `<div id="login-error" class="mt-2 text-center text-sm text-red-400">${err.responseJSON.message}</div>`
            $("#login-sub-section").append(loginError)
            
            // setTimeout(function(){
            //     $("#login-error").remove() 
            // }, 2000);

        })
        .always(_ => {
            console.log('MASUK Login-ALWAYS')
            $("#login-form").trigger('reset')
        })
}

function logout () {
    localStorage.removeItem('accesstoken')
    $("#login-error").remove()
    $("#register-success").remove()
    $("#main-table-todo-body").empty()
    checkAuth()
}

function register () {
    $.ajax({
        type: 'POST',
        url: baseURL + '/users/register',
        data: {
            email: $("#register-email").val(),
            password: $("#register-password").val()
        }
    })
        .done((response) => {
            console.log('MASUK Register-DONE')
            console.log(response)
            let regSuccess = `<div id="register-success" class="mt-2 text-center text-sm text-red-400">${response.message}!</div>`
            $("#login-error").remove()
            $("#register-section").hide()
            $("#login-section").show()
            $("#login-sub-section").append(regSuccess)
            $("#login-email").val(response.data)

        })
        .fail((err) => {
            $("#register-error").remove()
            console.log('MASUK Register-ERROR')
            console.log(err)
            let regError = `<div id="register-error" class="mt-2 text-center text-sm text-red-400">${err.responseJSON.message}</div>`
            $("#register-sub-section").append(regError)

        })
        .always(() => {
            console.log('MASUK Register-ALWAYS')
            $("#register-form").trigger('reset')
        })
}

function remove (todoId) {
    $.ajax({
        type: 'DELETE',
        url: baseURL + '/todos/' + todoId,
        headers: {accesstoken: localStorage.getItem('accesstoken')}
    })
        .done((response) => {
            console.log('MASUK Remove-DONE')
            $("#main-table-todo-body").empty()
            getTodos()
        })
        .fail((err) => {
            console.log('MASUK Remove-ERROR')
        })
        .always(() => {
            console.log('MASUK Remove-ALWAYS')
        })
}

function addNew () {
    $("#create-todo-error").remove()
    const inputData = {
        title: $("#new-todo-title").val(),
        description: $("#new-todo-description").val(),
        status: $("#new-todo-status").val(),
        due_date: $("#new-todo-due-date").val()
    }

    $.ajax({
        type: 'POST',
        url: baseURL + '/todos',
        data: inputData,
        headers: {accesstoken: localStorage.getItem('accesstoken')}
    })
        .done((response) => {
            console.log('MASUK addNew-DONE')
            console.log(response)
            checkAuth()
        })
        .fail((err) => {
            console.log('MASUK addNew-ERROR')
            console.log(err.responseJSON.message)

            $("#create-todo-error").remove()
            let addNewError = `
            <br/>
            <p id="create-todo-error" class="mt-1 text-sm text-red-600">
                ${err.responseJSON.message}.
            </p>`
            $("#create-todo-sidebar").after(addNewError)
        })
        .always(() => {
            console.log('MASUK addNew-ALWAYS')
        })

}