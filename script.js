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

    $("#toggle-modal").on("click", function () {
        $("#content-data-section").hide();
        $("#content-add-section").show();
        $("#toggle-modal").hide();
    });
    
    $("#content-add-cancel").on("click", function () { 
        $("#content-data-section").show();
        $("#content-add-section").hide();
        $("#toggle-modal").show();
    });

    $("#form-add-todo").submit(function (e) {
        e.preventDefault();
        createNewTodo();
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
    $("#content-section tbody").empty();
    $("#content-add-section").hide();
    $("#content-data-section").show();
    
    $.ajax({
        type: "GET",
        url: `${baseurl}/todos`,        
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done(response => {
        console.log("ni response dari server", response);
        let number = 0
        response.forEach(el => {
            number++
            let holiday = "";
            let holidayName = "";
            let formattedDate = new Date(el.due_date.value).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: "numeric"
            });

            if (el.due_date.holiday) {
                holidayName = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-grey-100 text-green-800">${el.due_date.holiday.holiday_type} Holiday</span>`
                holiday = `<div class="text-sm text-gray-500">${el.due_date.holiday.holiday_name}</div>`
            }
            

            $("#content-section tbody").append(`
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${number}.
                </td> 
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${el.title}
                </td> 
                <td class="px-6 py-4 whitespace text-sm text-gray-500">
                    ${el.description}
                </td>                                     
                <td class="px-6 py-4 whitespace-nowrap">
                    <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        ${el.status}
                    </span>
                </td>                                     
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formattedDate} ${holidayName}</div>
                    ${holiday}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                    </button>
                    <button onclick="deleteTodo(${el.id}, '${el.title}')" class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>                    
                </td>
            </tr>
            `);
        });
    })
    .fail(error => {
        console.log(error);
    })
}

function deleteTodo(id, name) {    
    swal({
        title: "Sure Delete",
        text: `Delete Todo ${name} ?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: "DELETE",
                url: `${baseurl}/todos/${id}`,
                headers: {
                    access_token: localStorage.getItem("access_token")
                }
            })
            .done(() => {
                swal("Your Todo has been deleted!", { icon: "success", });
                fetchData()
            })
            .fail(error => {
                console.log(error);
            })
        }
    });
}

function createNewTodo() {
    const formattedDueDate = new Date($("#due_date").val()).toLocaleDateString('fr-CA')
    const payload = {
        title: $("#title").val(),
        description: $("#description").val(),
        status: 'New',
        due_date: formattedDueDate,
    }
    console.log(payload);
    
    $.ajax({
        type: "POST",
        url: `${baseurl}/todos`,
        data: payload,
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done(response => {
        swal("Todo Saved", "Success create new todo", "success")
        fetchData()
    })
    .fail(error => {
        swal("Cannot Save Todo", error.responseJSON.message, "warning")
        console.log(error);
    })
}

function logout() {
    localStorage.clear()
    checkLogin()
}