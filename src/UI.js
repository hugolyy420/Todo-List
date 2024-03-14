import './styles.css';
import { taskManager } from './task';
import { projectManager } from './project';

//**AFTER complete project manager function logics */
//function for creating options element and pushing project tab name into each element(for loop)
//submit taskdialog, use projectManager to assign the task to the corresponding project tasks array
//

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

            if (array[i].hasOwnProperty('taskIndex')) {

                taskItem.dataset.number = array[i].taskIndex;

            } else {

                taskItem.dataset.number = i;

            }

            taskItem.append(taskCheckButton, taskTitleDiv, taskDueDateDiv, taskEditButton, taskDeleteButton);

            elementsToBeDisplayed.push(taskItem);

        }

        return elementsToBeDisplayed;

    }

    function createProjectElements(array) {

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
            projectTab.dataset.number = i + 1;

            projectTab.append(projectTabIcon, projectTabName, projectTabEditButton, projectTabDeleteButton);

            projectElementsToBeDisplayed.push(projectTab);

        }

        return projectElementsToBeDisplayed;

    }

    function createProjectOptionElements(array) {

        const projectOptionElementsArray = [];

        for (let i = 0; i < array.length; i++) {

            const projectName = array[i];
            const projectOption = document.createElement('option');

            projectOption.setAttribute('value', projectName);
            projectOption.textContent = projectName;

            projectOptionElementsArray.push(projectOption);

        }

        return projectOptionElementsArray;

    }

    function createTaskDetailsElement(taskDetails) {

        const detailContainer = document.createElement('div');
        detailContainer.classList.add('detail-container');

        taskDetails.forEach(taskDetail => {

            const detailGroup = document.createElement('div');
            const detailLabel = document.createElement('div');
            const detailValue = document.createElement('div');

            detailGroup.classList.add('detail-group');
            detailLabel.classList.add('detail-label');
            detailValue.classList.add('detail-value');

            detailLabel.textContent = taskDetail.label + ':';
            detailValue.textContent = taskDetail.value;

            detailGroup.appendChild(detailLabel);
            detailGroup.appendChild(detailValue);

            detailContainer.appendChild(detailGroup);

        })

        return detailContainer;
    }

    return { createTaskElements, createProjectElements, createProjectOptionElements, createTaskDetailsElement };

})();

const displayController = (() => {

    const taskDisplayHeading = document.querySelector('.task-display-heading');
    const tasksContainer = document.querySelector('.tasks-container');
    const projectsContainer = document.querySelector('.project-container');

    let inboxTab = true;
    let todayTab = false;
    let thisWeekTab = false;
    let completeTab = false;
    let projectTab = false;

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

        for (let i = 0; i < projectElementsToBeDisplayed.length; i++) {

            projectsContainer.appendChild(projectElementsToBeDisplayed[i]);

        };

    };

    function renderTaskDetails(taskDetails, taskElement) {

        const detailsElementToBeDisplayed = domElementsCreator.createTaskDetailsElement(taskDetails);
        taskElement.after(detailsElementToBeDisplayed);

    }

    function checkRenderingCondition(projectTasksArray, projectNameIndex) {

        if (inboxTab) {

            updateInboxTasksDisplay();

        } else if (todayTab) {

            updateTodayTasksDisplay();

        } else if (thisWeekTab) {

            updateThisWeekTasksDisplay();

        } else if (completeTab) {

            updateCompleteTasksDisplay();

        } else if (projectTab) {

            updateProjectTaskDisplays(projectTasksArray, projectNameIndex);

        }

    }

    function updateInboxTasksDisplay() {

        inboxTab = true;
        todayTab = false;
        thisWeekTab = false;
        completeTab = false;
        projectTab = false;

        taskManager.updateAllArrays();
        const inboxTasksArray = taskManager.getInboxTasks();

        taskDisplayHeading.textContent = 'Inbox';
        renderTasksDisplay(inboxTasksArray, completeTab);

    }

    function updateTodayTasksDisplay() {

        todayTab = true;
        inboxTab = false;
        thisWeekTab = false;
        completeTab = false;
        projectTab = false;

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
        projectTab = false;

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
        projectTab = false;

        taskManager.updateAllArrays();
        const completeTasksArray = taskManager.getCompleteTasksArray();

        taskDisplayHeading.textContent = 'Completed';
        renderTasksDisplay(completeTasksArray, completeTab);

    }

    function updateProjectTaskDisplays(projectTasksArray, projectNameIndex) {

        projectTab = true;
        todayTab = false;
        inboxTab = false;
        thisWeekTab = false;
        completeTab = false;

        taskManager.updateAllArrays();
        const projectNameList = projectManager.getEachProjectName();
        const projectName = projectNameList[projectNameIndex];

        if (projectName) {

            taskDisplayHeading.textContent = projectName;
            renderTasksDisplay(projectTasksArray, completeTab);

        } else {

            removeTasksDisplay();

        }

       

    }

    function updateProjectSelections() {

        const projectOptionsContainer = document.querySelector('.project-name-select');

        projectOptionsContainer.innerHTML = `<option value="Inbox">Inbox</option>`

        const updatedProjectNamesArray = projectManager.getEachProjectName();

        const projectOptionElementsToBeAdded = domElementsCreator.createProjectOptionElements(updatedProjectNamesArray);

        for (let i = 0; i < projectOptionElementsToBeAdded.length; i++) {

            projectOptionsContainer.appendChild(projectOptionElementsToBeAdded[i]);

        };

    }

    const isProjectTab = () => projectTab;

    function removeTasksDisplay () {

        tasksContainer.textContent = "";
        taskDisplayHeading.textContent = "";

    }

    return { renderTasksDisplay, updateInboxTasksDisplay, updateThisWeekTasksDisplay, updateTodayTasksDisplay, updateCompleteTasksDisplay, checkRenderingCondition, renderProjectsDisplay, updateProjectSelections, updateProjectTaskDisplays, isProjectTab, renderTaskDetails, removeTasksDisplay };

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
    const navBar = document.querySelector('.nav-bar');
    const projectNameSelect = document.querySelector('.project-name-select');
    const projectNameInput = document.querySelector('.project-name-input');
    let projectEditMode = false;
    let taskEditMode = false;


    addTaskButton.addEventListener('click', () => {

        addTaskDialog.showModal();

    });

    addProjectButton.addEventListener('click', () => {

        addProjectDialog.showModal();

    })

    projectForm.addEventListener('submit', event => {

        event.preventDefault();

        if (projectEditMode) {

            const newProjectName = projectNameInput.value;
            // const activeProjectTab = document.querySelector('.active');
            // let activeProjectTabInbex 

            // if (activeProjectTab) {

            //     activeProjectTabInbex = activeProjectTab.dataset.number;

            // }

            let editModeProjectTabIndex = projectManager.getEditModeProjectIndex();

            projectManager.setNewProjectName(newProjectName);

            const newProjectsArray = projectManager.getProjectArray();
            displayController.renderProjectsDisplay(newProjectsArray);

            displayController.updateProjectSelections();

            const projectTasksArray = taskManager.getProjectTasksArray(editModeProjectTabIndex);
            editModeProjectTabIndex--;

            displayController.checkRenderingCondition(projectTasksArray, editModeProjectTabIndex);

            addProjectDialog.close();
            projectForm.reset();
            projectEditMode = false;

        } else {

            const newProject = createNewProjectObject();
            projectManager.addProjectObjectToArray(newProject);

            const newProjectsArray = projectManager.getProjectArray();
            displayController.renderProjectsDisplay(newProjectsArray);

            displayController.updateProjectSelections();
            displayController.updateProjectTaskDisplays([], newProjectsArray.length - 1);

            addProjectDialog.close();
            projectForm.reset();

        }

    })

    taskForm.addEventListener('submit', event => {

        event.preventDefault();

        let projectName = getProjectName();
        let projectIndex = getProjectIndex();
        let projectTasksArray;

        if (taskEditMode) {

            const newTaskObject = createNewTaskObject(projectName, projectIndex);
            taskManager.updateTaskDetails(newTaskObject);

            if (projectIndex == 0) {

                displayController.updateInboxTasksDisplay();
                addTaskDialog.close();
                taskForm.reset();
                taskEditMode = false;
                return;

            } else {

                projectTasksArray = taskManager.getProjectTasksArray(projectIndex);
                projectIndex--;
                displayController.updateProjectTaskDisplays(projectTasksArray, projectIndex);
                addTaskDialog.close();
                taskForm.reset();
                taskEditMode = false;
                return;

            }
            
        }

        if (projectIndex !== 0) {

            const newTask = createNewTaskObject(projectName, projectIndex);
            taskManager.addTaskItemToArray(newTask);
            projectTasksArray = taskManager.getProjectTasksArray(projectIndex);
            projectIndex--;
            displayController.updateProjectTaskDisplays(projectTasksArray, projectIndex);
            addTaskDialog.close();
            taskForm.reset();
            return;
 
        };

        // if inbox project name input and in project tab`
        // get current tab index (active class)

        if (projectIndex == 0) {

            const newTask = createNewTaskObject(projectName, projectIndex);
            taskManager.addTaskItemToArray(newTask);
            displayController.updateInboxTasksDisplay();
            addTaskDialog.close();
            taskForm.reset();
            return;
        }

        // displayController.checkRenderingCondition();
        // addTaskDialog.close();
        // taskForm.reset();

    })

    tasksContainer.addEventListener('click', event => {

        const target = event.target;
        const taskItem = target.parentElement;
        const classNames = ['task-check-button', 'task-edit-button', 'task-delete-button'];

        if (target.classList.contains('task-check-button')) {

            taskManager.toggleTaskCompleteStatus(target.parentElement);

            if (displayController.isProjectTab()) {

                const taskElement = target.parentElement;
                const taskIndex = taskElement.dataset.number;
                let projectIndex = taskManager.getTaskProjectIndex(taskIndex);
                let projectTasksArray = taskManager.getProjectTasksArray(projectIndex);
                projectIndex--;
                displayController.checkRenderingCondition(projectTasksArray, projectIndex);
                return;

            }

            displayController.checkRenderingCondition();
            return;

        }

        if (target.classList.contains('task-edit-button')) {

            addTaskDialog.showModal();
            taskEditMode = true;

            const taskIndex = taskItem.dataset.number;
            taskManager.setTaskToEditMode(taskIndex);
            const taskInputFieldsList = document.querySelectorAll('.task-input-field');
            const taskEditDetails = taskManager.getTaskEditDetails(taskIndex);

            for (let i = 0; i < taskInputFieldsList.length; i++) {

                taskInputFieldsList[i].value = taskEditDetails[i].value;

            }
            
            return;

        }

        if (taskItem.classList.contains('task-item') && !(classNames.some(className => target.classList.contains(className)))) {

            const taskIndex = taskItem.dataset.number;
            const taskItemElement = taskItem;
            const detailsContainer = taskItemElement.nextElementSibling;

            if (detailsContainer && detailsContainer.classList.contains('detail-container')) {

                detailsContainer.remove();

            } else {

                const taskDetails = taskManager.getTaskDetails(taskIndex);
                displayController.renderTaskDetails(taskDetails, taskItemElement);

            }

        }

        if (target.classList.contains('task-item')) {

            const taskIndex = target.dataset.number;
            const taskItemElement = target;
            const detailsContainer = taskItemElement.nextElementSibling;

            if (detailsContainer && detailsContainer.classList.contains('detail-container')) {

                detailsContainer.remove();

            } else {

                const taskDetails = taskManager.getTaskDetails(taskIndex);
                displayController.renderTaskDetails(taskDetails, taskItemElement);

            }

        }

    })

    navBar.addEventListener('click', event => {

        const target = event.target;
        const projectElement = event.target.closest('.project-tab');

        if (target.classList.contains('project-edit-button')) {

            addProjectDialog.showModal();
            projectEditMode = true;

            const projectTab = target.parentElement;
            const projectIndex = projectTab.dataset.number;
            projectManager.setProjectObjectToEditMode(projectIndex)
            const projectName = projectManager.getProjectNameByProjectIndex(projectIndex);

            projectNameInput.value = projectName;
            return;

        }

        if (target.classList.contains('project-delete-button')) {

            const projectTab = target.parentElement;
            const projectIndex = projectTab.dataset.number;
            projectManager.deleteProjectByProjectIndex(projectIndex);
            taskManager.deleteTasksByProjectIndex(projectIndex);
            taskManager.updateAllArrays();

            const newProjectsArray = projectManager.getProjectArray();

            displayController.updateProjectSelections();

            displayController.renderProjectsDisplay(newProjectsArray);
            

            //if projectTabMode and target tab active => check rendering 
            // if projectTabMobe and target tab not active => no need rendering 
            

            displayController.updateInboxTasksDisplay();
            return;

        }

        if (projectElement) {

            const taskProjectIndex = projectElement.dataset.number;
            const projectNameIndex = projectManager.getProjectNameIndex(taskProjectIndex);

            const projectTasksArray = taskManager.getProjectTasksArray(taskProjectIndex);

            displayController.updateProjectTaskDisplays(projectTasksArray, projectNameIndex);

        }

    })

    inboxNavButton.addEventListener('click', () => displayController.updateInboxTasksDisplay());

    todayNavButton.addEventListener('click', () => displayController.updateTodayTasksDisplay());

    thisWeekNavButton.addEventListener('click', () => displayController.updateThisWeekTasksDisplay());

    completeNavButton.addEventListener('click', () => displayController.updateCompleteTasksDisplay());



    function createNewTaskObject(projectName, projectIndex) {

        const taskTitleValue = document.querySelector('.task-title-input').value;
        const taskDescriptionValue = document.querySelector('.task-description-input').value;
        const dueDateValue = document.querySelector('.due-date-input').value;
        const priorityValue = document.querySelector('.priority-input').value;

        return taskManager.createTaskItem(taskTitleValue, taskDescriptionValue, dueDateValue, priorityValue, projectName, projectIndex);

    }

    function createNewProjectObject() {

        const newProjectNameValue = document.querySelector('.project-name-input').value;
        return projectManager.createProjectObject(newProjectNameValue);

    }

    function getProjectName() {

        return projectNameSelect.value;

    }

    function getProjectIndex() {

        const projectIndex = projectNameSelect.selectedIndex;
        return projectIndex;

    }

})();

