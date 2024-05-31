const url = "http://localhost:3000/"

// return all users
async function getUsers() {
    let allUsers;
    await fetch(url + "users").then(res => {
        if (!res.ok) {
            throw new Error("Internet Problem")
        }
        return res.json()
    })
    .then(data => {
        allUsers = data
    })
    .catch(error => {
        alert("Server Error: " + error)
    })
    return allUsers
}

async function login() {
    const allUsers = await getUsers()
    const userInput = document.getElementById("usernameInputLogin").value;
    const passwordInput = document.getElementById("passwordInputLogin").value;
    for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        if (userInput == user["username"] || userInput == user["email"]) {
            if (passwordInput == user["password"]) {
                let keyOfUser = {
                    username: user["username"],
                }
                localStorage.setItem("userKey", JSON.stringify(keyOfUser))
                window.location.href = "./blog.html";
                break
            } else {
                alert("Wrong Password!")
                return
            }
        }
    }
    alert("User Not Found!")

}

function signUp() {

}

function addPost() {

}

function addComment() {

}

function editPost() {
    
}

function editComment() {

}

function displayPosts() {

}

