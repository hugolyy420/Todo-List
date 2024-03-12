import './styles.css';
import { taskManager } from './task';
import { projectManager } from './project';

const domElementsCreator = (() => {

    function createTaskElements(array, completeTab) {

        const elementsToBeDisplayed = [];
        const taskCheckButtonClassList = ['fa-regular', 'fa-circle', 'task-check-button'];
        const taskEditButtonClassList = ['fa-regular', 'fa-pen-to-square', 'task-edit-button'];
        const taskDeleteButtonClassList = ['fa-regular', 'fa-trash-can', 'task-delete-button'];

        for (let i = 0; i < array.length; i++) {

            if (!completeTab && array[i].complete) {
                continue;
            }

            const taskTitle = array[i].title;
            const taskDescription = array[i].description;
            const taskDueDate = array[i].formattedDueDate;
            const taskPriority = array[i].priority;

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

        }

        return elementsToBeDisplayed;

    }

    function createProjectElements(array) {

        //create an array to contain all project elements to be displayed
        //create elements one by one
        //for loop to extract project name and push it into textContent
        //push the finished element into array
        //return the array

        const projectElementsToBeDisplayed = [];
        const projectTabIconClassList = ['fa-solid', 'fa-list-check', 'project-tab-icon'];
        const projectTabEditButtonClassList = ['fa-regular', 'fa-pen-to-square', 'project-edit-button'];
        const projectTabDeleteButtonClassList = ['fa-regular', 'fa-trash-can', 'project-delete-button'];

        for (let i = 0; i < array.length; i++) {

            const projectName = array[i].name;

            const projectTab = document.createElement('div');
            const projectTabIcon = document.createElement('i');
            const projectTabName = document.createElement('div');
            const projectTabEditButton = document.createElement('i');
            const projectTabDeleteButton = document.createElement('i');

            projectTab.classList.add('project-tab');
            projectTabIcon.classList.add(...projectTabIconClassList);
            projectTabName.classList.add('project-tab-name');
            projectTabEditButton.classList.add(...projectTabEditButtonClassList);
            projectTabDeleteButton.classList.add(...projectTabDeleteButtonClassList);

            projectTabName.textContent = projectName;
            projectTab.dataset.number = i;

            projectTab.append(projectTabIcon, projectTabName, projectTabEditButton, projectTabDeleteButton);

            projectElementsToBeDisplayed.push(projectTab);

        }

        return projectElementsToBeDisplayed;

    }

    return { createTaskElements, createProjectElements };

})();

const displayController = (() => {

    const taskDisplayHeading = document.querySelector('.task-display-heading');
    const tasksContainer = document.querySelector('.tasks-container');
    const projectsContainer = document.querySelector('.project-container');

    let inboxTab = true;
    let todayTab = false;
    let thisWeekTab = false;
    let completeTab = false;

    function renderTasksDisplay(array, completeTab) {


        tasksContainer.textContent = "";

        const taskElementsToBeDisplayed = domElementsCreator.createTaskElements(array, completeTab);

        for (let i = 0; i < taskElementsToBeDisplayed.length; i++) {

            tasksContainer.appendChild(taskElementsToBeDisplayed[i]);

        };

    }

    function renderProjectsDisplay(array) {

        projectsContainer.textContent = "";

        const projectElementsToBeDisplayed = domElementsCreator.createProjectElements(array);

        console.log('projectArray:' + projectElementsToBeDisplayed);

        for (let i = 0; i < projectElementsToBeDisplayed.length; i++) {

            projectsContainer.appendChild(projectElementsToBeDisplayed[i]);

        };

    };

    function checkRenderingCondition() {

        if (inboxTab) {

            updateInboxTasksDisplay();

        } else if (todayTab) {

            updateTodayTasksDisplay();

        } else if (thisWeekTab) {

            updateThisWeekTasksDisplay();

        } else if (completeTab) {

            updateCompleteTasksDisplay();

        }

    }

    function updateInboxTasksDisplay() {

        inboxTab = true;
        todayTab = false;
        thisWeekTab = false;
        completeTab = false;

        taskManager.updateAllArrays();
        const inboxTasksArray = taskManager.getInboxTaskArray();

        taskDisplayHeading.textContent = 'Inbox';
        renderTasksDisplay(inboxTasksArray, completeTab);

    }

    function updateTodayTasksDisplay() {

        todayTab = true;
        inboxTab = false;
        thisWeekTab = false;
        completeTab = false;

        taskManager.updateAllArrays();
        const todayTasksArray = taskManager.getTodayTasksArray();

        taskDisplayHeading.textContent = 'Today';
        renderTasksDisplay(todayTasksArray, completeTab);

    }

    function updateThisWeekTasksDisplay() {

        thisWeekTab = true;
        todayTab = false;
        inboxTab = false;
        completeTab = false;

        taskManager.updateAllArrays();
        const thisWeekTasksArray = taskManager.getThisWeekTasksArray();

        taskDisplayHeading.textContent = 'This Week';
        renderTasksDisplay(thisWeekTasksArray, completeTab);

    }

    function updateCompleteTasksDisplay() {

        completeTab = true;
        todayTab = false;
        inboxTab = false;
        thisWeekTab = false;

        taskManager.updateAllArrays();
        const completeTasksArray = taskManager.getCompleteTasksArray();

        taskDisplayHeading.textContent = 'Completed';
        renderTasksDisplay(completeTasksArray, completeTab);

    }

    // function updateProject

    return { renderTasksDisplay, updateInboxTasksDisplay, updateThisWeekTasksDisplay, updateTodayTasksDisplay, updateCompleteTasksDisplay, checkRenderingCondition, renderProjectsDisplay };

})();

(function createEvents() {


    const addTaskDialog = document.querySelector('.task-dialog');
    const addProjectDialog = document.querySelector('.project-dialog');
    const taskForm = document.querySelector('.task-form');
    const projectForm = document.querySelector('.project-form');
    const addTaskButton = document.querySelector('.add-task-button');
    const addProjectButton = document.querySelector('.add-project-button');
    const todayNavButton = document.querySelector('.today');
    const inboxNavButton = document.querySelector('.inbox');
    const thisWeekNavButton = document.querySelector('.this-week');
    const completeNavButton = document.querySelector('.complete');
    const tasksContainer = document.querySelector('.tasks-container');


    addTaskButton.addEventListener('click', () => {

        addTaskDialog.showModal();

    });

    addProjectButton.addEventListener('click', () => {

        addProjectDialog.showModal();

    })

    projectForm.addEventListener('submit', event => {

        event.preventDefault();

        const newProject = createNewProjectObject();
        projectManager.addProjectObjectToArray(newProject);
        const newProjectsArray = projectManager.getProjectArray();
        console.log(newProjectsArray);
        displayController.renderProjectsDisplay(newProjectsArray);
        addProjectDialog.close();
        projectForm.reset();


    })

    taskForm.addEventListener('submit', event => {

        event.preventDefault();

        const newTask = createNewTaskObject();
        taskManager.addTaskItemToArray(newTask);
        displayController.checkRenderingCondition();
        addTaskDialog.close();
        taskForm.reset();

    })

    tasksContainer.addEventListener('click', event => {

        const target = event.target;

        if (target.classList.contains('task-check-button')) {

            taskManager.toggleTaskCompleteStatus(target.parentElement);
            displayController.checkRenderingCondition();

        }

    })

    inboxNavButton.addEventListener('click', () => displayController.updateInboxTasksDisplay());

    todayNavButton.addEventListener('click', () => displayController.updateTodayTasksDisplay());

    thisWeekNavButton.addEventListener('click', () => displayController.updateThisWeekTasksDisplay());

    completeNavButton.addEventListener('click', () => displayController.updateCompleteTasksDisplay());

    function createNewTaskObject() {

        const taskTitleValue = document.querySelector('.task-title-input').value;
        const taskDescriptionValue = document.querySelector('.task-description-input').value;
        const dueDateValue = document.querySelector('.due-date-input').value;
        const priorityValue = document.querySelector('.priority-input').value;

        return taskManager.createTaskItem(taskTitleValue, taskDescriptionValue, dueDateValue, priorityValue);

    }

    function createNewProjectObject() {

        const newProjectNameValue = document.querySelector('.project-name').value;
        return projectManager.createProjectObject(newProjectNameValue);

    }

})();

