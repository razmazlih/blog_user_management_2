const url = "https://blog-user-management-2.onrender.com/"

function theDate() {
    const nowTime = (new Date()).toLocaleString('en-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    return nowTime;
}
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
        });
    return allUsers;
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
                    user_id: user["id"],
                    username: user["username"]
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
            alert("Server Error: " + error)
        });
    window.location.href = "./index.html";
    alert("Success");
}

async function addPost() {
    const myTitle = document.getElementById("postTitleInput").value;
    const mycontent = document.getElementById("postContentInput").value;
    const selfId = JSON.parse(localStorage.getItem("userKey"))["user_id"];

    let postToAdd = {
        user_id: selfId,
        title: myTitle,
        content: mycontent,
        created_at: theDate()
    }

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
        .catch(error => {
            alert("Server Error: " + error)
        });
    window.location.href = "./blog.html"
    alert("Success!");
}

async function addComment(postIdx) {
    const selfcontent = document.getElementById("post-input-" + postIdx).value;
    const selfId = JSON.parse(localStorage.getItem("userKey"))["user_id"];

    const commentToAdd = {
        post_id: postIdx,
        user_id: selfId,
        content: selfcontent,
        created_at: theDate()
    };

    await fetch(url + "comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(commentToAdd)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Error")
            }
            return res.json()
        })
        .catch(error => {
            alert("Server Error: " + error)
        });
    alert("Success!");
}

function editPost(commentidx) {

}

async function deletePost(postIdx) {
    fetch(url + "posts/" + postIdx, {
        method: "DELETE",
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Error")
            }
            return res.json()
        })
        .catch(error => {
            alert("Error: ", error)
        });
}

async function editComment(commentIdx) {
    const newComment = {
        content: prompt("Enter The New Comment")
    }
    await fetch(url + "comments/" + commentIdx, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newComment)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Error");
            }
        })
        .catch(error => {
            alert("Server Error: " + error);
        });
}

async function deleteComment(commentIdx) {
    await fetch(url + "comments/" + commentIdx, {
        method: "DELETE",
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Error")
            }
        })
        .catch(error => {
            alert("Server Error: " + error)
        })
}

async function getUsernameById(userId) {
    let usersData;
    await fetch(url + "users")
        .then(res => {
            if (!res.ok) {
                throw new Error("internet Error")
            }
            return res.json()
        })
        .then(data => {
            usersData = data
        })
        .catch(error => {
            alert("Server Error: " + error)
        });
    const user = usersData.find(user => user.id === userId);
    return user ? user.username : null;
}


async function displayPosts() {
    const divAllBlogs = document.getElementById("allBlogs");
    const myStorge = JSON.parse(localStorage.getItem("userKey"));
    const selfId = myStorge["user_id"];
    let allPosts;
    let allComments;

    await fetch(url + "posts")
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Error");
            }
            return res.json()
        })
        .then(data => {
            allPosts = data;
        })
        .catch(error => {
            alert("Server Error: " + error)
        });

    await fetch(url + "comments")
        .then(res => {
            if (!res.ok) {
                throw new Error("Internet Error");
            }
            return res.json()
        })
        .then(data => {
            allComments = data;
        });

    let finalStr = "";

    for (let postsIdx = 0; postsIdx < allPosts.length; postsIdx++) {
        const post = allPosts[postsIdx];
        let startPost = `
            <div class="post-content">
                <h2 class="post-header">${post["title"]}</h2>
                <p class="post-content">${post["content"]}</p>
            </div>
            `;
        let endPost = "";
        if (selfId == post["user_id"]) {
            endPost += `
                <div class="post-buttons">
                    <button class="edit-post-button" onclick="editPost('${post["id"]}')">Edit Post</button>
                    <button class="delete-post-button" onclick="deletePost('${post["id"]}')">Delete Post</button>
                </div>
                `
        }
        endPost += `<p class="post-date">Posted At: ${post["created_at"]}</p>`
        let commentsStr = "";
        for (let commentsIdx = 0; commentsIdx < allComments.length; commentsIdx++) {
            const comment = allComments[commentsIdx];

            if (post["id"] == comment["post_id"]) {

                if (selfId == comment["user_id"]) {
                    commentsStr += `
                        <h3 class="comment-header">${await getUsernameById(comment["user_id"])}</h3>
                        <p class="comment-content">${comment["content"]}</p>
                        <div class="comment-buttons">
                            <button class="edit-comment-button" onclick="editComment('${comment["id"]}')">Edit Comment</button>
                            <button class="delete-comment-button" onclick="deleteComment('${comment["id"]}')">Delete Comment</button>
                        </div>
                        <span class="comment-date">Commended At: ${comment["created_at"]}</span>
                        `
                } else {
                    commentsStr += `
                        <h3 class="comment-header">${await getUsernameById(comment["user_id"])}</h3>
                        <p class="comment-content">${comment["content"]}</p>
                        <span class="comment-date">Commended At: ${comment["created_at"]}</span>
                        `
                }
            }
        }
        commentsStr += `
        <div class="post-add-comment">
        <input id="post-input-${post["id"]}">
        <button class="add-post-button" onclick="addComment('${post["id"]}')">Add Comment</button>
    </div>
        `
        finalStr += `
            <div class="post-conteiner">${startPost + endPost}</div>
            <div class="comments-conteiner">${commentsStr}</div>
            `;
    }

    divAllBlogs.innerHTML = finalStr;
}

if (window.location.pathname.endsWith("blog.html")) {
    displayPosts()
}

