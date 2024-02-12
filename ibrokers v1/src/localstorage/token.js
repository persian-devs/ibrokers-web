export function saveToken(token){
    console.log(`token saved by value == ${token}`);
    localStorage.setItem('token',token)
}

export function getToken(){
    // console.log(`token ${data}`);
    const token = localStorage.getItem('token')
    // localStorage.setItem('access', data.access)
    // console.log(`get token == ${token}`);
    return token;
}