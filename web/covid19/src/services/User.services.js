const REGISTER_URL = 'http://127.0.0.1:8000/register';
const LOGIN_URL = 'http://127.0.0.1:8000/login';
export function register_user(full_name, email, password){
    var json = {
        'full_name': full_name,        
        'email': email,        
        'password': password        
    }
    var xhr = new XMLHttpRequest();
    xhr.open("POST", REGISTER_URL+'?full_name='+full_name+'&email='+email+'&password='+password);

    xhr.setRequestHeader("Content-Type", "application/json");
    let statusCode = 0;
    
    xhr.send(JSON.stringify(json));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            console.log(xhr.status);
            console.log(xhr.responseText);
        }
    };

}

export function login_user(email, password){
    var statusCode = 0;
    var respose = '';

    return fetch(LOGIN_URL+'?email='+email+'&password='+password).then(function(response) {
        statusCode = response.status; // returns 200
        return statusCode;
      });
  
}
