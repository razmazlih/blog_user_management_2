const url = "https://blog-user-management-2.onrender.com/";

function theDate() {
    return (new Date()).toLocaleString('en-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Fetch helper function
async function fetchData(endpoint, options = {}) {
    const response = await fetch(url + endpoint, options);
    if (!response.ok) throw new Error("Internet Problem");
    return response.json();
}

async function getUsers() {
    try {
        return await fetchData("users");
    } catch (error) {
        alert("Server Error: " + error);
    }
}

async function login() {
    const allUsers = await getUsers();
    const userInput = document.getElementById("usernameInputLogin").value;
    const passwordInput = document.getElementById("passwordInputLogin").value;
    const user = allUsers.find(user => user.username === userInput || user.email === userInput);

    if (user && user.password === passwordInput) {
        localStorage.setItem("userKey", JSON.stringify({ user_id: user.id, username: user.username }));
        window.location.href = "./blog.html";
    } else {
        alert(user ? "Wrong Password!" : "User Not Found!");
    }
}

async function signUp() {
    const allUsers = await getUsers();
    const emailInput = document.getElementById("emailInputSignIn").value;
    const usernameInput = document.getElementById("usernameInputSignIn").value;
    const passwordInput = document.getElementById("passwordInputSignIn").value;
    const passAgainInput = document.getElementById("passwordInputSignInVari").value;

    if (allUsers.some(user => user.email === emailInput)) {
        alert("Email taken. Please choose another.");
        return;
    }
    if (allUsers.some(user => user.username === usernameInput)) {
        alert("Username taken. Please choose another.");
        return;
    }
    if (passwordInput !== passAgainInput) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const newUser = { username: usernameInput, email: emailInput, password: passwordInput };

    try {
        await fetchData("users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
        alert("Success");
        window.location.href = "./index.html";
    } catch (error) {
        alert("Server Error: " + error);
    }
}

async function addPost() {
    const myTitle = document.getElementById("postTitleInput").value;
    const mycontent = document.getElementById("postContentInput").value;
    const selfId = JSON.parse(localStorage.getItem("userKey")).user_id;

    const postToAdd = {
        user_id: selfId,
        title: myTitle,
        content: mycontent,
        created_at: theDate()
    };

    try {
        await fetchData("posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postToAdd)
        });
        alert("Success!");
        window.location.href = "./blog.html";
    } catch (error) {
        alert("Server Error: " + error);
    }
}

async function addComment(postIdx) {
    const selfcontent = document.getElementById("post-input-" + postIdx).value;
    const selfId = JSON.parse(localStorage.getItem("userKey")).user_id;

    const commentToAdd = {
        post_id: postIdx,
        user_id: selfId,
        content: selfcontent,
        created_at: theDate()
    };

    try {
        await fetchData("comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentToAdd)
        });
        alert("Success!");
    } catch (error) {
        alert("Server Error: " + error);
    }
}

async function deletePost(postIdx) {
    try {
        await fetchData("posts/" + postIdx, { method: "DELETE" });
    } catch (error) {
        alert("Error: " + error);
    }
}

async function editComment(commentIdx) {
    const newContent = prompt("Enter The New Comment");
    if (!newContent) return;

    const updatedComment = { content: newContent };

    try {
        await fetchData("comments/" + commentIdx, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedComment)
        });
    } catch (error) {
        alert("Server Error: " + error);
    }
}

async function deleteComment(commentIdx) {
    try {
        await fetchData("comments/" + commentIdx, { method: "DELETE" });
    } catch (error) {
        alert("Server Error: " + error);
    }
}

async function getUsernameById(userId) {
    const usersData = await getUsers();
    const user = usersData.find(user => user.id === userId);
    return user ? user.username : null;
}

async function displayPosts() {
    const divAllBlogs = document.getElementById("allBlogs");
    const { user_id: selfId } = JSON.parse(localStorage.getItem("userKey"));
    let allPosts, allComments;

    try {
        allPosts = await fetchData("posts");
        allComments = await fetchData("comments");
    } catch (error) {
        alert("Server Error: " + error);
        return;
    }

    let finalStr = "";

    for (const post of allPosts) {
        let startPost = `
            <div class="post-content">
                <h2 class="post-header">${post.title}</h2>
                <p class="post-content">${post.content}</p>
            </div>
        `;
        let endPost = "";

        if (selfId == post.user_id) {
            endPost += `
                <div class="post-buttons">
                    <button class="edit-post-button" onclick="editPost('${post.id}')">Edit Post</button>
                    <button class="delete-post-button" onclick="deletePost('${post.id}')">Delete Post</button>
                </div>
            `;
        }
        endPost += `<p class="post-date">Posted At: ${post.created_at}</p>`;

        let commentsStr = "";
        for (const comment of allComments) {
            if (post.id == comment.post_id) {
                commentsStr += `
                    <h3 class="comment-header">${await getUsernameById(comment.user_id)}</h3>
                    <p class="comment-content">${comment.content}</p>
                `;
                if (selfId == comment.user_id) {
                    commentsStr += `
                        <div class="comment-buttons">
                            <button class="edit-comment-button" onclick="editComment('${comment.id}')">Edit Comment</button>
                            <button class="delete-comment-button" onclick="deleteComment('${comment.id}')">Delete Comment</button>
                        </div>
                    `;
                }
                commentsStr += `<span class="comment-date">Commended At: ${comment.created_at}</span>`;
            }
        }
        commentsStr += `
            <div class="post-add-comment">
                <input id="post-input-${post.id}">
                <button class="add-post-button" onclick="addComment('${post.id}')">Add Comment</button>
            </div>
        `;
        finalStr += `
            <div class="post-conteiner">${startPost + endPost}</div>
            <div class="comments-conteiner">${commentsStr}</div>
        `;
    }

    divAllBlogs.innerHTML = finalStr;
}

if (window.location.pathname.endsWith("blog.html")) {
    displayPosts();
}
