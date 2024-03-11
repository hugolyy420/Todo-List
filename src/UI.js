import './styles.css';
import { taskManager } from './task';

//move dom task input content to make task item
//loop through the array and display all task items


const domElementsCreator = (() => {

    function createTaskElement (array) {

        const tasksContainer = document.querySelector('.tasks-container');
        tasksContainer.textContent = "";

        for (let i = 0; i < array.length; i++) {

            const taskTitle = array[i].title;
            const taskDescription = array[i].description;
            const taskDueDate = array[i].formattedDueDate;
            const taskPriority = array[i].priority;

            const taskCheckButtonClassList = ['fa-regular', 'fa-circle', 'task-check-button'];
            const taskEditButtonClassList = ['fa-regular', 'fa-pen-to-square'];
            const taskDeleteButtonClassList = ['fa-regular', 'fa-trash-can'];
    
            const taskItem = document.createElement('div')
            const taskCheckButton = document.createElement('i');
            const taskTitleDiv = document.createElement('div');
            const taskDueDateDiv = document.createElement('div');
            const taskEditButton = document.createElement('i');
            const taskDeleteButton = document.createElement('i');

            taskCheckButton.classList.add(...taskCheckButtonClassList);
            taskTitleDiv.classList.add('task-title');
            taskDueDateDiv.classList.add('task-date');
            taskEditButton.classList.add(...taskEditButtonClassList);
            taskDeleteButton.classList.add(...taskDeleteButtonClassList);
            taskItem.classList.add('task-item');

            taskTitleDiv.textContent = taskTitle;
            taskDueDateDiv.textContent = taskDueDate;
    
            if (array[i].hasOwnProperty('id')) {
    
                taskItem.dataset.number = array[i].id;
    
            } else {
    
                taskItem.dataset.number = i;
    
            }

            taskItem.append(taskCheckButton, taskTitleDiv, taskDueDateDiv, taskEditButton, taskDeleteButton);
            
    
            // const taskCheckButton = document.querySelector('.task-check-button');
            // taskCheckButton.add
            
            tasksContainer.appendChild(taskItem);
    
        }


    }

    return {createTaskElement};

})();

const displayController = (() => {

    const taskDisplayHeading = document.querySelector('.task-display-heading');

    let inbox = true;
    let today = false;
    let thisWeek = false;

    function renderTasksDisplay (array) {

    domElementsCreator.createTaskElement(array);

}

    function checkRenderingCondition (array) {

        if (inbox) {

            updateInboxTasksDisplay(array);

        } else if (today) {

            updateTodayTasksDisplay(array);

        } else {

            updateThisWeekTasksDisplay(array);

        }

    }

    function updateInboxTasksDisplay () {

        inbox = true;
        today = false;
        thisWeek = false;

        const inboxTasksArray = taskManager.getInboxTaskArray();

        taskDisplayHeading.textContent = 'Inbox';
        renderTasksDisplay(inboxTasksArray);

    }   

    function updateTodayTasksDisplay () {

        today = true;
        inbox = false;
        thisWeek = false;

        taskManager.createTodayTasksArray();
        const todayTasksArray = taskManager.getTodayTasksArray();

        taskDisplayHeading.textContent = 'Today';
        renderTasksDisplay(todayTasksArray);

    }

    function updateThisWeekTasksDisplay () {

        thisWeek = true;
        today = false;
        inbox = false;

        taskManager.createThisWeekTasksArray();
        const thisWeekTasksArray = taskManager.getThisWeekTasksArray();

        taskDisplayHeading.textContent = 'This Week';
        renderTasksDisplay(thisWeekTasksArray);

    }

    return {renderTasksDisplay, updateInboxTasksDisplay, updateThisWeekTasksDisplay, updateTodayTasksDisplay, checkRenderingCondition};

})();

(function createEvents () {

    const addTaskButton = document.querySelector('.add-task-button');
    const taskDialog = document.querySelector('.task-dialog');
    const taskForm = document.querySelector('.task-form');
    const todayNavButton = document.querySelector('.today');
    const inboxNavButton = document.querySelector('.inbox');
    const thisWeekNavButton = document.querySelector('.this-week');

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
        displayController.checkRenderingCondition(tasksArray);
        taskDialog.close();
        taskForm.reset();

    })

    inboxNavButton.addEventListener('click', () => displayController.updateInboxTasksDisplay());

    todayNavButton.addEventListener('click', () => displayController.updateTodayTasksDisplay());

    thisWeekNavButton.addEventListener('click', () => displayController.updateThisWeekTasksDisplay());

    
})();

