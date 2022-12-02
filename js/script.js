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

apiListTasks().then((response) => {
    response.data.forEach(obj => console.log(obj.title));
})










