    apiListTasks().then((tasks) => {
        tasks.data.forEach(obj => {
            // console.log(obj.id);
            console.log(apiListOperationsForTask(obj.id));
        });
    });