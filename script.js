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
                    user_id: user["id"]
                }
                localStorage.setItem("userKey", JSON.stringify(keyOfUser))
                window.location.href = "./blog.html";
                return
            } else {
                alert("Wrong Password!")
                return
            }
        }
    }
    alert("User Not Found!")

}

async function signUp() {
    const allUsers = await getUsers();
    const emailInput = document.getElementById("emailInputSignIn").value;
    const usernameInput = document.getElementById("usernameInputSignIn").value;
    const passwordInput = document.getElementById("passwordInputSignIn").value;
    const passAgainInput = document.getElementById("passwordInputSignInVari").value;

    for (let i = 0; i < allUsers.length; i++) {
        const user = allUsers[i];
        const validEmail = user["email"] === emailInput;
        const validUsername = user["username"] === usernameInput;
        if (validEmail) {
            alert("Email taken. Please choose another.");
            return;
        }
        if (validUsername) {
            alert("Username taken. Please choose another.");
            return;
        }
    }

    if (passwordInput !== passAgainInput) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const newUser = {
        username: usernameInput,
        email: emailInput,
        password: passwordInput
    };

    let myData;

    await fetch(url + "users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Problem");
            }
            return res.json();
        })
        .then(data => {
            myData = data;
        })
        .catch(error => {
            console.log("Error: " + error);
        });
    window.location.href = "./index.html";
    alert("Success");
}

async function addPost() {
    const myTitle = document.getElementById("postTitleInput").value;
    const mycontent = document.getElementById("postContentInput").value;
    const selfId = JSON.parse(localStorage.getItem("userKey"))["user_id"];
    const dateNow = (new Date()).toLocaleString('en-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    let postToAdd = {
        user_id: selfId,
        title: myTitle,
        content: mycontent,
        created_at: dateNow
    }

    let myData;

    await fetch(url + "posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postToAdd)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Error");
            }
            return res.json()
        })
        .then(data => {
            myData = data
        });
    let selfAllPosts = JSON.parse(localStorage.getItem("postsId")) || [];
    selfAllPosts.push(myData["id"])
    localStorage.setItem("postsId", JSON.stringify(selfAllPosts))
}

function addComment() {

}

function editPost() {

}

function editComment() {

}

function displayPosts() {

}

