const baseurl = "http://localhost:3000";

$(document).ready(function () {
    document.title = 'Todo Apps';

    checkLogin();

    $("#form-login").submit(function (e) { 
        e.preventDefault();
        login();
    });

    $("#nav-logout").on("click", function () {
        logout();
    });
    
    $("#nav-dashboard").on("click", function () {
        checkLogin();
    });
        
    $("#btn-register").on("click", function () {
        $("#login-section").hide();
        $("#register-section").show();
    });
    
    $("#btn-login").on("click", function () {
        $("#login-section").show();
        $("#register-section").hide();
    });

    $("#btn-add-todo").on("click", function () {
        $("#content-data-section").hide();
        $("#content-add-section").show();
        $("#btn-add-todo").hide();
        $("#form-add-todo").trigger("reset");
    });
    
    $("#content-add-cancel").on("click", function () {
        $("#content-data-section").show();
        $("#content-add-section").hide();
        $("#btn-add-todo").show();
    });

    $("#btn-edit-cancel-todo").on("click", function () { 
        $("#content-data-section").show();
        $("#content-edit-section").hide();
        $("#btn-add-todo").show();
        $("#form-edit-todo").trigger("reset");
    });

    $("#form-add-todo").submit(function (e) {
        e.preventDefault();
        createNewTodo();        
    });

    $("#form-register").submit(function (e) { 
        e.preventDefault();
        registerUser();
    });    

    $("#form-edit-todo").submit(function (e) {
        e.preventDefault();
        let todoId = $("#inp-todo-id").val();
        putTodo(todoId);
    }); 
});

function registerUser() {
    const payload = {
        email: $("#register-email").val(),
        password: $("#register-password").val()
    };

    $.ajax({
        type: "POST",
        url: `${baseurl}/users/register`,
        data: payload,        
    })
    .done(() => {
        swal("Success", "Register New User Success", "success");
        checkLogin();
        $("#form-login").trigger("reset");
    })
    .fail(error => {
        const { responseJSON } = error;
        swal("Error", responseJSON.message, "error");
    });
}

function checkLogin() {
    if (localStorage.getItem("access_token")) {
        $("#navbar-section").show();
        $("#login-section").hide();
        $("#content-section").show();
        $("#register-section").hide();
        fetchData();
    } else {
        $("#navbar-section").hide();
        $("#login-section").show();
        $("#content-section").hide();
        $("#register-section").hide();
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
        const { responseJSON } = error;
        swal("Error", responseJSON.message, "error");
    });
}

function fetchData() {
    $("#content-section tbody").empty();
    $("#content-add-section").hide();
    $("#content-data-section").show();
    $("#btn-add-todo").show();
    $("#content-edit-section").hide();
    
    $.ajax({
        type: "GET",
        url: `${baseurl}/todos`,        
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done(response => {
        if (!response.length) {
            $("#content-section tbody").append(`
            <tr>
                <td colspan="6" align="center" class="text-sm text-gray-500">--No Data--</td>
            </tr>
            `)
        }        

        response.forEach((el, idx) => {            
            const { id, due_date, title, description, status } = el;
            let bgColor = "green";
            let holiday = "";
            let holidayName = "";
            let formattedDate = new Date(due_date.value).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: "numeric"
            });

            switch (status) {
                case "New":
                    bgColor = "blue";
                    break;
                case "Process":
                    bgColor = "yellow";
                    break;
                case "Complete":
                    bgColor = "red";
                    break
                default:
                    break;
            }

            if (due_date.holiday) {
                const { holiday_name } = due_date.holiday;                
                holidayName = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-grey-100 text-green-800">${el.due_date.holiday.holiday_type}</span>`;
                holiday = `<div class="text-sm text-gray-500">${holiday_name}</div>`;
            }

            $("#content-section tbody").append(`
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${idx + 1}.
                </td> 
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${title}
                </td> 
                <td class="px-6 py-4 whitespace text-sm text-gray-500">
                    ${description}
                </td>                                     
                <td class="px-6 py-4 whitespace-nowrap">
                    <span
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${bgColor}-100 text-green-800">
                        ${status}
                    </span>
                </td>                                     
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${formattedDate} ${holidayName}</div>
                    ${holiday}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button onclick="showEditTodo(${id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit
                    </button>
                    <button onclick="deleteTodo(${id}, '${title}')" class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>                    
                </td>
                <td class="px-6 py-4">                    
                    <select id="status-action-${id}" name="status_action" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option value="New">New</option>
                        <option value="Process">Process</option>
                        <option value="Complete">Complete</option>
                    </select>
                    <button onclick="updateStatus(${id})" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Save Status
                    </button>                    
                </td>
            </tr>
            `);
        });       
    })
    .fail(error => {
        const { responseJSON } = error;
        swal("Error", responseJSON.message, "error");
    });
}

function showEditTodo(id) {
    $.ajax({
        type: "GET",
        url: `${baseurl}/todos/${id}`,
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })    
    .done(response => {
        const { due_date, title, description } = response;
        const formattedDueDate = new Date(due_date.value).toLocaleDateString('fr-CA');
        $("#content-data-section").hide();
        $("#content-edit-section").show();
        $("#btn-add-todo").hide();
        $("#title-edit").val(title);
        $("#due_date-edit").val(formattedDueDate);
        $("#description-edit").val(description);
        $("#inp-todo-id").val(id);
    })
    .fail(error => {
        const { responseJSON } = error;
        console.log("Error showEditTodo ", error);
        swal("Error", responseJSON.message, "error");
    });
}

function updateStatus(id) {
    const status = $(`#status-action-${id}`).val();
    const payload = { status };

    $.ajax({
        type: "PATCH",
        url: `${baseurl}/todos/${id}`,
        data: payload, 
        headers: {
            access_token: localStorage.getItem("access_token")
        }       
    })
    .done(() => {
        swal(`Success change status to ${status}`);
        fetchData();
    })
    .fail(error => {
        const { responseJSON } = error;
        swal("Error", responseJSON.message, "error");
    });
}

function putTodo(id) {
    const payload = {
        title: $("#title-edit").val(),
        due_date: $("#due_date-edit").val(),
        description: $("#description-edit").val(),
    }

    $.ajax({
        type: "PUT",
        url: `${baseurl}/todos/${id}`,
        data: payload,
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(() => {
        swal("Success", "Success Update Data", "success");
        fetchData();
        $("#form-edit-todo").trigger("reset");
    })
    .fail(error => {
        const { responseJSON } = error;
        console.log("error di put", error);
        swal("Error", responseJSON.message, "error");
    });
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
                fetchData();
            })
            .fail(error => {
                const { responseJSON } = error;
                swal("Error", responseJSON.message, "error");
            });
        }
    });
}

function createNewTodo() {
    $("#submit").hide();
    $("#content-add-cancel").hide();
    const formattedDueDate = new Date($("#due_date").val()).toLocaleDateString('fr-CA');
    const payload = {
        title: $("#title").val(),
        description: $("#description").val(),
        status: 'New',
        due_date: formattedDueDate,
    };
    
    $.ajax({
        type: "POST",
        url: `${baseurl}/todos`,
        data: payload,
        headers: {
            access_token: localStorage.getItem("access_token")
        }
    })
    .done(() => {
        swal("Todo Saved", "Success create new todo", "success");
        $("#submit").show();
        $("#content-add-cancel").show();
        fetchData();
    })
    .fail(error => {
        swal("Cannot Save Todo", error.responseJSON.message, "warning");
        $("#submit").show();
        $("#content-add-cancel").show();
    });
}

function logout() {
    localStorage.clear();
    checkLogin();
    googleSignOut();
    facebookSignOut();
}

function googleSignIn(googleUser) {
    const id_token = googleUser.getAuthResponse().id_token;
    const payload = {
        google_token: id_token
    };

    $.ajax({
        type: "POST",
        url: `${baseurl}/users/google-login`,
        data: payload,        
    })
    .done(response => {
        localStorage.setItem('access_token', response.access_token);
        checkLogin();
        $("#form-login").trigger("reset");
    })
    .fail(error => {
        const { responseJSON } = error
        swal("Error", responseJSON.message, "error")
    });
}

function renderGoogleSignIn() {
    gapi.signin2.render('google-signin', {
        'scope': 'profile email',
        'width': 400,
        'height': 40,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': googleSignIn
    });
}

function googleSignOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log("Signed Out");
    });
}

function facebookStatusChangeCallback(response) {
    if (response.status === 'connected') facebookSignIn();
}

function checkFacebookLogin() {
    FB.getLoginStatus(response => {
        facebookStatusChangeCallback(response);
    });
}

function facebookSignIn() {
    FB.api(
        '/me',
        'GET',
        { "fields": "email,name" }, 
        (fbResponse) => {
            $.ajax({
                type: "POST",
                url: `${baseurl}/users/facebook-login`,
                data: fbResponse
            })
            .done(response => {
                localStorage.setItem('access_token', response.access_token);
                checkLogin();
                $("#form-login").trigger("reset");
            })
            .fail(error => {
                const { responseJSON } = error;
                swal("Error", responseJSON.message, "error");
            })
        }
    );
}

function facebookSignOut() {    
    FB.logout(function(response) {
        console.log("Signed Out", response);
    });
}