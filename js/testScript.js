    apiListTasks().then((tasks) => {
        tasks.data.forEach(obj => {
            apiListOperationsForTask(obj.id).then(option => {
                option.data.forEach(el => {
                    console.log(el.timeSpent);
                });
            });
        });
    });