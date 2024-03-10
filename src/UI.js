import './styles.css';
import { taskManager } from './task';

//move dom task input content to make task item
//loop through the array and display all task items

const addTaskButton = document.querySelector('.add-task-button');
const taskDialog = document.querySelector('.task-dialog');
const taskForm = document.querySelector('.task-form');
const todayNavButton = document.querySelector('.today');
const inboxNavButton = document.querySelector('.inbox');
const taskDisplayHeading = document.querySelector('.task-display-heading');

(function createEvents () {

    addTaskButton.addEventListener('click', () => {

        taskDialog.showModal();

});
    
    taskForm.addEventListener('submit',  event => {

        event.preventDefault();

        const taskTitleValue = document.querySelector('.task-title-input').value;
        const taskDescriptionValue = document.querySelector('.task-description-input').value;
        const dueDateValue = document.querySelector('.due-date-input').value;
        const priorityValue = document.querySelector('.priority-input').value;
        const newTask = taskManager.createTaskItem(taskTitleValue, taskDescriptionValue, dueDateValue, priorityValue);
        const tasksArray = taskManager.getInboxTaskArray();

        taskManager.addTaskItemToArray(newTask);
        updateTasksDisplay(tasksArray);
        taskDialog.close();
        taskForm.reset();

    })

    inboxNavButton.addEventListener('click', () => {

        const tasksArray = taskManager.getInboxTaskArray();

        taskDisplayHeading.textContent = 'Inbox';
        updateTasksDisplay(tasksArray);

    })

    todayNavButton.addEventListener('click', () => {

        const tasksArray = taskManager.getInboxTaskArray();
        const todayTasksArray = taskManager.getTodayTasksArray(tasksArray)

        taskDisplayHeading.textContent = 'Today';
        updateTasksDisplay(todayTasksArray);

    })
    
})();

// const displayController = 

function updateTasksDisplay (array) {
    
    const tasksContainer = document.querySelector('.tasks-container');
    tasksContainer.textContent = "";

    for (let i = 0; i < array.length; i++) {

        const taskTitle = array[i].title;
        const taskDescription = array[i].description;
        const taskDueDate = array[i].formattedDueDate;
        const taskPriority = array[i].priority;

        const taskItem = document.createElement('div')
        taskItem.classList.add('task-item');

        taskItem.innerHTML = `<i class="fa-regular fa-circle task-check-button"></i>
        <div class="task-title">${taskTitle}</div>
        <div class="task-date">${taskDueDate}</div>
        <i class="fa-regular fa-pen-to-square"></i>
        <i class="fa-regular fa-trash-can"></i>`
        
        tasksContainer.appendChild(taskItem);

    }

}