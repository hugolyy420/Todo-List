import './styles.css';
import { taskManager } from './task';

//move dom task input content to make task item
//loop through the array and display all task items


const domElementsCreator = (() => {

    function createTaskElements (array, completeTab) {

        const elementsToBeDisplayed = [];

        for (let i = 0; i < array.length; i++) {

            if ( !completeTab && array[i].complete) {
                continue;
            }

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

            elementsToBeDisplayed.push(taskItem);
            
            // tasksContainer.appendChild(taskItem);
    
        }

        return elementsToBeDisplayed;

    }

    return {createTaskElements};

})();

// const domElementsEventsCreator = (() => {

//     function createTaskCompleteEvent (taskContainer) {

//         taskContainer.addEventListener

//     }

// })()

const displayController = (() => {

    const taskDisplayHeading = document.querySelector('.task-display-heading');
    const tasksContainer = document.querySelector('.tasks-container');

    let inboxTab = true;
    let todayTab = false;
    let thisWeekTab = false;
    let completeTab = false;

    function renderTasksDisplay (array, completeTab) {


    tasksContainer.textContent = "";

    const taskElementsToBeDisplayed = domElementsCreator.createTaskElements(array, completeTab);

    for (let i = 0; i < taskElementsToBeDisplayed.length; i++) {

        tasksContainer.appendChild(taskElementsToBeDisplayed[i]);

    };

}

    function checkRenderingCondition (array) {

        if (inboxTab) {

            updateInboxTasksDisplay(array);

        } else if (todayTab) {

            updateTodayTasksDisplay(array);

        } else if (thisWeekTab){

            updateThisWeekTasksDisplay(array);

        } else if (completeTab){

            updateCompleteTasksDisplay(array);

        }

    }

    function updateInboxTasksDisplay () {

        inboxTab = true;
        todayTab = false;
        thisWeekTab = false;
        completeTab = false;

        const inboxTasksArray = taskManager.getInboxTaskArray();

        taskDisplayHeading.textContent = 'Inbox';
        renderTasksDisplay(inboxTasksArray, completeTab);

    }   

    function updateTodayTasksDisplay () {

        todayTab = true;
        inboxTab = false;
        thisWeekTab = false;
        completeTab = false;

        taskManager.createTodayTasksArray();
        const todayTasksArray = taskManager.getTodayTasksArray();

        taskDisplayHeading.textContent = 'Today';
        renderTasksDisplay(todayTasksArray, completeTab);

    }

    function updateThisWeekTasksDisplay () {

        thisWeekTab = true;
        todayTab = false;
        inboxTab = false;
        completeTab = false;

        taskManager.createThisWeekTasksArray();
        const thisWeekTasksArray = taskManager.getThisWeekTasksArray();

        taskDisplayHeading.textContent = 'This Week';
        renderTasksDisplay(thisWeekTasksArray, completeTab);

    }

    function updateCompleteTasksDisplay () {

        completeTab = true;
        todayTab = false;
        inboxTab = false;
        thisWeekTab = false;

        taskManager.createCompletetaskArray();
        const completeTasksArray = taskManager.getCompleteTasksArray();

        taskDisplayHeading.textContent = 'Completed';
        renderTasksDisplay(completeTasksArray, completeTab);

    }

    return {renderTasksDisplay, updateInboxTasksDisplay, updateThisWeekTasksDisplay, updateTodayTasksDisplay, updateCompleteTasksDisplay, checkRenderingCondition};

})();

(function createEvents () {

    const addTaskButton = document.querySelector('.add-task-button');
    const taskDialog = document.querySelector('.task-dialog');
    const taskForm = document.querySelector('.task-form');
    const todayNavButton = document.querySelector('.today');
    const inboxNavButton = document.querySelector('.inbox');
    const thisWeekNavButton = document.querySelector('.this-week');
    const completeNavButton = document.querySelector('.complete');
    const tasksContainer = document.querySelector('.tasks-container');

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

    tasksContainer.addEventListener('click', event => {

        const target = event.target;

        if (target.classList.contains('task-check-button')) {

            taskManager.toggleTaskCompleteStatus(target.parentElement);
            displayController.checkRenderingCondition(taskManager.getInboxTaskArray);

        }

    })

    inboxNavButton.addEventListener('click', () => displayController.updateInboxTasksDisplay());

    todayNavButton.addEventListener('click', () => displayController.updateTodayTasksDisplay());

    thisWeekNavButton.addEventListener('click', () => displayController.updateThisWeekTasksDisplay());

    completeNavButton.addEventListener('click', () => displayController.updateCompleteTasksDisplay());

})();

