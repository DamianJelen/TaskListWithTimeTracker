const apikey = "37b5e7e3-6711-46ec-91fd-b84438a96cf1";
// const apikey = "f73c024f-a6aa-4b85-a709-6b2846ff296a";
const apihost = 'https://todo-api.coderslab.pl';

function apiListTasks() {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: { Authorization: apikey }
        }
    ).then(
        function(resp) {
            if(!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        });
}

function apiListOperationsForTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
            headers: {Authorization: apikey}
        }
    ).then((resp) => {
        if (!resp.ok) {
            alert('Problem z wczytaniem operacji!!!');
        }
        return resp.json();
    })
}

function apiCreateTask(title, description) {
    return fetch(
        apihost + '/api/tasks',
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'open'}),
            method: 'POST'
        })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd!!!');
            }
            return resp.json();
        });
}

function apiCreateOperation(taskId, description) {
    return fetch(
        apihost + '/api/tasks/' + taskId + '/operations',
        {
                headers: {Authorization: apikey, 'Content-Type': 'application/json'},
                body: JSON.stringify({description: description, timeSpent: '0'}),
                method: 'POST'
            }).then(function (resp) {
                if (!resp.ok) {
                    alert('Wystapił błąd podczas dodawania operacji do zadania!!!');
                }
                return resp.json();
            });
}

function apiDeleteTask(taskId) {
    return fetch(
        apihost + '/api/tasks/' + taskId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }).then((resp) => {
            if(!resp.ok) {
                alert('Wystapił błąd podczas usuwania zadania!!!');
            }
            return 'Usunięto zadanie o id: ' + taskId;
        });
}

function apiDeleteOperation(operationId) {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
            headers: {Authorization: apikey},
            method: 'DELETE'
        }).then(function (resp) {
           if (!resp.ok) {
               alert('Wystapił błąd podczas dodawania operacji do zadania!!!');
           }
           return 'Usunieto operacje o id: ' + operationId;
        });
}

function apiUpdateTask(taskId, title, description) {
    return fetch(
        apihost + "/api/tasks/" + taskId,
        {
            headers: {Authorization: apikey, 'Content-Type': 'application/json'},
            body: JSON.stringify({title: title, description: description, status: 'close'}),
            method: 'PUT'
            }).then((resp) => {
                if(!resp.ok) {
                    alert('Wystąpił błąd podczas zamykania zadania!!!');
                }
                return resp.json();
            });
}

function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(
        apihost + '/api/operations/' + operationId,
        {
                headers: {Authorization: apikey, 'Content-Type': 'application/json'},
                body: JSON.stringify({description: description, timeSpent: timeSpent}),
                method: 'PUT'
        }).then((response) => {
            if (!response.ok) {
                alert('Wystapił błąd podczas modyfikacji czasu operacji!!!');
            }
            return response.json();
        });
}

function renderTask(taskId, title, description, status) {
    // console.log('Zadanie o id =', taskId);
    // console.log('tytuł to:', title);
    // console.log('opis to:', description);
    // console.log('status to:', status);
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    section.id = taskId;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerTitleDescDiv = document.createElement('div');
    headerDiv.appendChild(headerTitleDescDiv);

    const titleH5 = document.createElement('h5');
    titleH5.innerText = title;
    headerTitleDescDiv.appendChild(titleH5);

    const descriptionH6 = document.createElement('h6');
    descriptionH6.innerText = description;
    headerTitleDescDiv.appendChild(descriptionH6);

    const headerBtnDiv = document.createElement('div');
    headerDiv.appendChild(headerBtnDiv);

    const headerBtnFinish = document.createElement('button');
    headerBtnFinish.className = 'btn btn-dark btn-sm js-task-open-only';
    headerBtnFinish.innerText = 'Finish'
    headerBtnDiv.appendChild(headerBtnFinish);
    headerBtnFinish.addEventListener('click', () => {
        apiUpdateTask(taskId, title, description).then((resp) => {
            // status = resp.data.status;
            console.log(taskId, resp.data.status);
        });
        // headerBtnFinish.parentElement.parentElement.parentElement.lastElementChild.remove();
        // let liElements = headerBtnFinish.parentElement.parentElement.nextElementSibling.childNodes;
        // liElements.forEach(elem => {
        //     console.log(elem.querySelector('div.js-task-open-only').remove());
        // });
    });

    const headerBtnDel = document.createElement('button');
    headerBtnDel.className = 'btn btn-outline-danger btn-sm ml-2';
    headerBtnDel.innerText = 'Delete';
    headerBtnDiv.appendChild(headerBtnDel);
    headerBtnDel.addEventListener('click', () => {
        apiListOperationsForTask(taskId).then((operations) => {
            operations.data.forEach(operation => apiDeleteOperation(operation.id));
        });
        apiDeleteTask(taskId).then(() => {
            headerBtnDel.parentElement.parentElement.parentElement.remove();
        });
    });

    // ul list operations
    const ulListGroup = document.createElement('ul');
    ulListGroup.className = 'list-group list-group-flush';
    section.appendChild(ulListGroup);

    apiListOperationsForTask(taskId).then(operations => {
        operations.data.forEach(operation => {
            renderOperation(ulListGroup, status, operation.id, operation.description, operation.timeSpent);
        })
    })

    // input Operations in section
    if (status === 'open') {
        const inputOperationDiv = document.createElement('div');
        inputOperationDiv.className = 'card-body js-task-open-only';
        section.appendChild(inputOperationDiv);

        const inputOperationForm = document.createElement('form');
        inputOperationDiv.appendChild(inputOperationForm);

        const divInputGroup = document.createElement('div');
        divInputGroup.className = 'input-group';
        inputOperationForm.appendChild(divInputGroup);

        const inputOperation = document.createElement('input');
        inputOperation.className = 'form-control';
        inputOperation.setAttribute('type', 'text');
        inputOperation.setAttribute('placeholder', 'Operation description');
        inputOperation.setAttribute('minlength', '5');
        divInputGroup.appendChild(inputOperation);

        const divInputGroupAppend = document.createElement('div');
        divInputGroupAppend.className = 'input-group-append';
        divInputGroup.appendChild(divInputGroupAppend);

        const btnInputGroupAppend = document.createElement("button");
        btnInputGroupAppend.className = 'btn btn-info';
        btnInputGroupAppend.innerText = 'Add';
        divInputGroupAppend.appendChild(btnInputGroupAppend);
        btnInputGroupAppend.addEventListener('click', (event) => {
            apiCreateOperation(taskId, inputOperation.value).then(
                function (response) {
                    renderOperation(ulListGroup, status, response.data.id, response.data.description, response.data.timeSpent);
                }
            );
            inputOperation.value = null;
            event.preventDefault();
        })
    }

    document.querySelector('main').appendChild(section);
}

function renderOperation(ulEl, taskStatus, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.id = operationId;
    ulEl.appendChild(li);

    const divOperationDescription = document.createElement('div');
    divOperationDescription.innerText = operationDescription;
    li.appendChild(divOperationDescription);

    const spanOperationDescription = document.createElement('span');
    spanOperationDescription.className = 'badge badge-success badge-pill ml-2';
    spanOperationDescription.innerText = showHourMinutes(timeSpent);
    divOperationDescription.appendChild(spanOperationDescription);

    const divOperationBtn = document.createElement('div');
    divOperationBtn.className = 'js-task-open-only';
    li.appendChild(divOperationBtn);

    if (taskStatus === 'open') {
        const btn15m = document.createElement('button');
        btn15m.className = 'btn btn-outline-success btn-sm mr-2';
        btn15m.innerText = '+15m';
        divOperationBtn.appendChild(btn15m);
        btn15m.addEventListener('click', function() {
            let newTime = parseInt(timeSpent) + 15;
            apiUpdateOperation(operationId, operationDescription, newTime).then((response) => {
                btn15m.parentElement.previousElementSibling.firstElementChild.innerHTML = showHourMinutes(response.data.timeSpent);
                timeSpent = newTime;
            });
        });

        const btn1h = document.createElement('button');
        btn1h.className = 'btn btn-outline-success btn-sm mr-2';
        btn1h.innerText = '+1h';
        divOperationBtn.appendChild(btn1h);
        btn1h.addEventListener('click', function() {
            apiUpdateOperation(operationId, operationDescription, timeSpent + 60).then((response) => {
                btn1h.parentElement.previousElementSibling.firstElementChild.innerHTML = showHourMinutes(response.data.timeSpent);
                timeSpent = parseInt(timeSpent) + 60;
            });
        });

        const btnDel = document.createElement('button');
        btnDel.className = 'btn btn-outline-danger btn-sm';
        btnDel.innerText = 'Delete';
        divOperationBtn.appendChild(btnDel);
        btnDel.addEventListener('click', () => {
            apiDeleteOperation(operationId);
            btnDel.parentElement.parentElement.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    apiListTasks().then((tasks) => {
        tasks.data.forEach(task => {
            renderTask(task.id, task.title, task.description, task.status);
        })
    })

    // const btnAddTask = document.querySelector('form.js-task-adding-form');
    // btnAddTask.addEventListener('submit', function(event){
    //     event.preventDefault();
    //     apiCreateTask(event.target.elements.title.value, event.target.elements.description.value);
    // })

    document.querySelector('.js-task-adding-form').addEventListener('submit', function(event) {
        event.preventDefault();
        apiCreateTask(event.target.elements.title.value, event.target.elements.description.value).then(
            function(response) { renderTask(response.data.id, response.data.title, response.data.description, response.data.status) }
        )
        event.target.elements.title.value = null;
        event.target.elements.description.value = null;
    });

})

function showHourMinutes(minutes) {
    if (minutes >= 60) {
        let hour = parseInt(minutes / 60);
        minutes = minutes % 60;
        return hour + 'h ' + minutes + 'm';
    } else if (minutes < 60) {
        return minutes + 'm';
    }
}




