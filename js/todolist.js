(function () {
    "use strict";

    const itemInput = document.getElementById("item-input");
    const todoAddForm = document.getElementById("todo-add");
    const ul = document.getElementById("todo-list");
    const lis = ul.getElementsByTagName("li");

    let arrTasks = getSavedData();

    //    function addEventLi(li) {
    //      li.addEventListener("click", function () {
    //        console.log(this);
    //  });
    //}

    function getSavedData() {
        let tasksData = localStorage.getItem("tasks");
        tasksData = JSON.parse(tasksData);

        return tasksData && tasksData.length ? tasksData : [
                {
                    name: "Task 1",
                    createdAt: Date.now(),
                    completed: false,
                },
            ];
    }

    function setNewData() {
        localStorage.setItem("tasks", JSON.stringify(arrTasks));
    }

    setNewData();

    function generateLiTask(obj) {
        const li = document.createElement("li");
        const p = document.createElement("p");
        const checkBtn = document.createElement("button");
        const editBtn = document.createElement("i");
        const deleteBtn = document.createElement("i");

        li.className = "todo-item";

        checkBtn.className = "button-check";
        checkBtn.innerHTML =
            "<i class='fas fa-check displayNone' data-action='checkBtn'></i>";
        checkBtn.setAttribute("data-action", "checkBtn");

        li.appendChild(checkBtn);

        p.className = "task-name";
        p.textContent = obj.name;
        li.appendChild(p);

        editBtn.className = "fas fa-edit";
        editBtn.setAttribute("data-action", "editBtn");
        li.appendChild(editBtn);

        const containerEdit = document.createElement("div");
        containerEdit.className = "editContainer";
        const inputEdit = document.createElement("input");
        inputEdit.setAttribute("type", "text");
        inputEdit.className = "editInput";
        inputEdit.value = obj.name;

        containerEdit.appendChild(inputEdit);
        const containerEditBtn = document.createElement("button");
        containerEditBtn.className = "editButton";
        containerEditBtn.textContent = "Edit";
        containerEditBtn.setAttribute("data-action", "containerEditBtn");
        containerEdit.appendChild(containerEditBtn);
        const containerCancelBtn = document.createElement("button");
        containerCancelBtn.className = "cancelButton";
        containerCancelBtn.textContent = "Cancel";
        containerCancelBtn.setAttribute("data-action", "containerCancelBtn");
        containerEdit.appendChild(containerCancelBtn);

        li.appendChild(containerEdit);

        deleteBtn.className = "fas fa-trash-alt";
        deleteBtn.setAttribute("data-action", "deleteBtn");
        li.appendChild(deleteBtn);

        //        addEventLi(li);

        return li;
    }

    function renderTasks() {
        ul.innerHTML = "";
        arrTasks.forEach((task) => {
            ul.appendChild(generateLiTask(task));
        });
    }

    function addTask(task) {
        arrTasks.push({
            name: task,
            createdAt: Date.now(),
            completed: false,
        });

        setNewData();
    }

    function clickedUl(e) {
        const dataAction = e.target.getAttribute("data-action");
        if (!dataAction) return;

        let currentLi = e.target;
        while (currentLi.nodeName !== "LI") {
            currentLi = currentLi.parentElement;
        }
        const currentLiIndex = [...lis].indexOf(currentLi);

        const actions = {
            editBtn: function () {
                const editContainer = currentLi.querySelector(".editContainer");

                [...ul.querySelectorAll(".editContainer")].forEach(
                    (container) => {
                        container.removeAttribute("style");
                    }
                );

                editContainer.style.display = "flex";
            },
            deleteBtn: function () {
                arrTasks.splice(currentLiIndex, 1);
                console.log(arrTasks);
                renderTasks();
                setNewData();
                //urrentLi.remove()
                //currentLi.parentElement.removeCHild(currentLi)
            },

            containerEditBtn: function () {
                const val = currentLi.querySelector(".editInput").value;
                arrTasks[currentLiIndex].name = val;
                renderTasks();
                setNewData();
            },

            containerCancelBtn: function () {
                currentLi
                    .querySelector(".editContainer")
                    .removeAttribute("style");

                currentLi.querySelector(".editInput").value =
                    arrTasks[currentLiIndex].name;
            },

            checkBtn: function () {
                arrTasks[currentLiIndex].completed =
                    !arrTasks[currentLiIndex].completed;

//                if (arrTasks[currentLiIndex].completed) {
//                    currentLi
//                        .querySelector(".fa-check")
//                        .classList.remove("displayNone");
//                } else {
//                    currentLi
//                        .querySelector(".fa-check")
//                        .classList.add("displayNone");
//                }

                setNewData();
                renderTasks();
            },
        };

        if (actions[dataAction]) {
            actions[dataAction]();
        }
    }

    todoAddForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log(itemInput.value);
        //        ul.innerHTML += `
        //       <li class="todo-item">
        //            <p class="task-name">${itemInput.value}</p>
        //        </li>`;

        addTask(itemInput.value);
        renderTasks();

        itemInput.value = "";
        itemInput.focus();
    });

    ul.addEventListener("click", clickedUl);

    renderTasks();
})();
