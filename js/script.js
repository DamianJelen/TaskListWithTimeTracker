const apikey = "37b5e7e3-6711-46ec-91fd-b84438a96cf1";
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

function renderTask(taskId, title, description, status) {
    // console.log('Zadanie o id =', taskId);
    // console.log('tytuł to:', title);
    // console.log('opis to:', description);
    // console.log('status to:', status);
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';

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

    const headerBtnDel = document.createElement('button');
    headerBtnDel.className = 'btn btn-outline-danger btn-sm ml-2';
    headerBtnDel.innerText = 'Delete';
    headerBtnDiv.appendChild(headerBtnDel);

    document.querySelector('main').appendChild(section);
}

document.addEventListener('DOMContentLoaded', function() {
    apiListTasks().then((tasks) => {
        tasks.data.forEach(task => {
            renderTask(task.id, task.title, task.description, task.status);
        })
    })
})









