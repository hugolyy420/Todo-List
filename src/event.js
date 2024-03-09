const addTaskButton = document.querySelector('.add-task-button');
const taskDialog = document.querySelector('.task-dialog');


export const eventLists = {
    callTaskDialog: function () {
        addTaskButton.addEventListener('click', () => {
        taskDialog.showModal();
});
    }
}



