apiListTasks().then((tasks) => {
    tasks.data.forEach(obj => {
        // console.log(obj.id)
        apiListOperationsForTask(obj.id);
    });
})