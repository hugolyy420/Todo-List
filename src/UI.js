import './styles.css';
import { taskManager } from './task';
import { projectManager } from './project';
import { localStorageManager } from './localStorage';

const domElementsCreator = (() => {
  function createTaskElements(array, completeTab) {
    const elementsToBeDisplayed = [];
    const taskCheckButtonClassList = [
      'fa-regular',
      'fa-circle',
      'task-check-button',
    ];
    const taskCheckedButtonClassList = [
      'fa-regular',
      'fa-circle-check',
      'task-check-button',
    ];
    const taskEditButtonClassList = [
      'fa-regular',
      'fa-pen-to-square',
      'task-edit-button',
    ];
    const taskDeleteButtonClassList = [
      'fa-regular',
      'fa-trash-can',
      'task-delete-button',
    ];

    for (let i = 0; i < array.length; i++) {
      if (!completeTab && array[i].complete) {
        continue;
      }

      const taskTitle = array[i].title;
      const taskDescription = array[i].description;
      const taskDueDate = array[i].formattedDueDate;
      const taskPriority = array[i].priority;

      const taskItem = document.createElement('div');
      const taskCheckButton = document.createElement('i');
      const taskTitleDiv = document.createElement('div');
      const taskDueDateDiv = document.createElement('div');
      const taskEditButton = document.createElement('i');
      const taskDeleteButton = document.createElement('i');

      if (completeTab) {
        taskCheckButton.classList.add(...taskCheckedButtonClassList);
      } else {
        taskCheckButton.classList.add(...taskCheckButtonClassList);
      }

      taskTitleDiv.classList.add('task-title');
      taskDueDateDiv.classList.add('task-date');
      taskEditButton.classList.add(...taskEditButtonClassList);
      taskDeleteButton.classList.add(...taskDeleteButtonClassList);
      taskItem.classList.add('task-item');

      if (taskPriority === 'low') {
        taskItem.classList.add('low-priority');
      } else if (taskPriority === 'medium') {
        taskItem.classList.add('medium-priority');
      } else {
        taskItem.classList.add('high-priority');
      }

      taskTitleDiv.textContent = taskTitle;
      taskDueDateDiv.textContent = taskDueDate;

      if (array[i].hasOwnProperty('taskIndex')) {
        taskItem.dataset.number = array[i].taskIndex;
      } else {
        taskItem.dataset.number = i;
      }

      taskItem.append(
        taskCheckButton,
        taskTitleDiv,
        taskDueDateDiv,
        taskEditButton,
        taskDeleteButton,
      );

      elementsToBeDisplayed.push(taskItem);
    }

    return elementsToBeDisplayed;
  }

  function createProjectElements(array) {
    const projectElementsToBeDisplayed = [];
    const projectTabIconClassList = [
      'fa-solid',
      'fa-list-check',
      'project-tab-icon',
    ];
    const projectTabEditButtonClassList = [
      'fa-regular',
      'fa-pen-to-square',
      'project-edit-button',
    ];
    const projectTabDeleteButtonClassList = [
      'fa-regular',
      'fa-trash-can',
      'project-delete-button',
    ];

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

      projectTab.append(
        projectTabIcon,
        projectTabName,
        projectTabEditButton,
        projectTabDeleteButton,
      );

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

    taskDetails.forEach((taskDetail) => {
      const detailGroup = document.createElement('div');
      const detailLabel = document.createElement('div');
      const detailValue = document.createElement('div');

      detailGroup.classList.add('detail-group');
      detailLabel.classList.add('detail-label');
      detailValue.classList.add('detail-value');

      detailLabel.textContent = `${taskDetail.label}:`;
      detailValue.textContent = taskDetail.value;

      detailGroup.appendChild(detailLabel);
      detailGroup.appendChild(detailValue);

      detailContainer.appendChild(detailGroup);
    });

    return detailContainer;
  }

  return {
    createTaskElements,
    createProjectElements,
    createProjectOptionElements,
    createTaskDetailsElement,
  };
})();

const displayController = (() => {
  const taskDisplayHeading = document.querySelector('.task-display-heading');
  const tasksContainer = document.querySelector('.tasks-container');
  const projectsContainer = document.querySelector('.project-container');
  const navButtons = document.querySelectorAll('.nav-button');

  let inboxTab = true;
  let todayTab = false;
  let thisWeekTab = false;
  let completeTab = false;
  let projectTab = false;

  function renderTasksDisplay(array, completeTab) {
    tasksContainer.textContent = '';

    const taskElementsToBeDisplayed = domElementsCreator.createTaskElements(
      array,
      completeTab,
    );

    for (let i = 0; i < taskElementsToBeDisplayed.length; i++) {
      tasksContainer.appendChild(taskElementsToBeDisplayed[i]);
    }
  }

  function renderProjectsDisplay(array) {
    projectsContainer.textContent = '';

    const projectElementsToBeDisplayed =
      domElementsCreator.createProjectElements(array);

    for (let i = 0; i < projectElementsToBeDisplayed.length; i++) {
      projectsContainer.appendChild(projectElementsToBeDisplayed[i]);
    }
  }

  function renderTaskDetails(taskDetails, taskElement) {
    const detailsElementToBeDisplayed =
      domElementsCreator.createTaskDetailsElement(taskDetails);
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

    removeActiveClass();
    navButtons[0].classList.add('active');
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

    removeActiveClass();
    navButtons[1].classList.add('active');
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

    removeActiveClass();
    navButtons[2].classList.add('active');
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

    removeActiveClass();
    navButtons[3].classList.add('active');
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

    const projectTabs = document.querySelectorAll('.project-tab');

    if (projectTabs.length > 0) {
      removeActiveClass();
      projectTabs[projectNameIndex].classList.add('active');
    }

    taskManager.updateAllArrays();
    const projectNameList = projectManager.getEachProjectName();
    const projectName = projectNameList[projectNameIndex];

    taskDisplayHeading.textContent = projectName;
    renderTasksDisplay(projectTasksArray, completeTab);
  }

  function updateProjectSelections() {
    const projectOptionsContainer = document.querySelector(
      '.project-name-select',
    );

    projectOptionsContainer.innerHTML = `<option value="Inbox">Inbox</option>`;

    const updatedProjectNamesArray = projectManager.getEachProjectName();

    const projectOptionElementsToBeAdded =
      domElementsCreator.createProjectOptionElements(updatedProjectNamesArray);

    for (let i = 0; i < projectOptionElementsToBeAdded.length; i++) {
      projectOptionsContainer.appendChild(projectOptionElementsToBeAdded[i]);
    }
  }

  const isProjectTab = () => projectTab;

  function removeActiveClass() {
    const projectTabs = document.querySelectorAll('.project-tab');
    navButtons.forEach((nav) => nav.classList.remove('active'));

    if (projectTabs) {
      projectTabs.forEach((tab) => tab.classList.remove('active'));
    }
  }

  return {
    renderTasksDisplay,
    updateInboxTasksDisplay,
    updateThisWeekTasksDisplay,
    updateTodayTasksDisplay,
    updateCompleteTasksDisplay,
    checkRenderingCondition,
    renderProjectsDisplay,
    updateProjectSelections,
    updateProjectTaskDisplays,
    isProjectTab,
    renderTaskDetails,
  };
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
  const taskSubmitButton = document.querySelector('.task-submit-button');
  const taskDialogHeading = document.querySelector('.task-dialog-heading');
  const projectSubmitButton = document.querySelector('.project-submit-button');
  const projectDialogHeading = document.querySelector(
    '.project-dialog-heading',
  );
  const taskDialogCloseButton = document.querySelector('.task-close-button');
  const projectDialogCloseButton = document.querySelector(
    '.project-close-button',
  );
  const projectDropDownButton = document.querySelector(
    '.project-drop-down-button',
  );
  const dropDownMenuContainer = document.querySelector(
    '.drop-down-menu-container',
  );
  const hamburgerMenuButton = document.querySelector('.hamburger-menu-button');
  let projectEditMode = false;
  let taskEditMode = false;

  addTaskButton.addEventListener('click', () => {
    addTaskDialog.showModal();
    taskDialogHeading.textContent = 'Add Task';
    taskSubmitButton.value = 'Add Task';
  });

  addProjectButton.addEventListener('click', () => {
    addProjectDialog.showModal();
    projectDialogHeading.textContent = 'Add Project';
    projectSubmitButton.value = 'Add Project';
  });

  projectDropDownButton.addEventListener('click', (event) => {
    event.target.classList.toggle('rotate');
    dropDownMenuContainer.classList.toggle('hide');
  });

  hamburgerMenuButton.addEventListener('click', () => {
    navBar.classList.toggle('show');
  });

  taskDialogCloseButton.addEventListener('click', () => {
    if (taskEditMode) {
      const taskObjectInEditMode = taskManager.getTaskObjectInEditMode();
      taskObjectInEditMode.edit = false;
      taskEditMode = false;
    }

    addTaskDialog.close();
    taskForm.reset();
  });

  projectDialogCloseButton.addEventListener('click', () => {
    if (projectEditMode) {
      const projectObjectInEditMode =
        projectManager.getProjectObjectInEditMode();
      projectObjectInEditMode.edit = false;
      projectEditMode = false;
    }

    addProjectDialog.close();
    projectForm.reset();
  });

  projectForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (projectEditMode) {
      const newProjectName = projectNameInput.value;
      let editModeProjectTabIndex = projectManager.getEditModeProjectIndex();

      projectManager.setNewProjectName(newProjectName);

      const newProjectsArray = projectManager.getProjectArray();
      displayController.renderProjectsDisplay(newProjectsArray);

      displayController.updateProjectSelections();

      const projectTasksArray = taskManager.getProjectTasksArray(
        editModeProjectTabIndex,
      );
      editModeProjectTabIndex--;

      displayController.checkRenderingCondition(
        projectTasksArray,
        editModeProjectTabIndex,
      );

      addProjectDialog.close();
      projectForm.reset();
      projectEditMode = false;
    } else {
      const newProject = createNewProjectObject();
      projectManager.addProjectObjectToArray(newProject);

      const newProjectsArray = projectManager.getProjectArray();
      displayController.renderProjectsDisplay(newProjectsArray);

      displayController.updateProjectSelections();
      displayController.updateProjectTaskDisplays(
        [],
        newProjectsArray.length - 1,
      );

      addProjectDialog.close();
      projectForm.reset();
    }
  });

  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const projectName = getProjectName();
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
      }
      projectTasksArray = taskManager.getProjectTasksArray(projectIndex);
      projectIndex--;
      displayController.updateProjectTaskDisplays(
        projectTasksArray,
        projectIndex,
      );
      addTaskDialog.close();
      taskForm.reset();
      taskEditMode = false;
      return;
    }

    if (projectIndex !== 0) {
      const newTask = createNewTaskObject(projectName, projectIndex);
      taskManager.addTaskItemToArray(newTask);
      projectTasksArray = taskManager.getProjectTasksArray(projectIndex);
      projectIndex--;
      displayController.updateProjectTaskDisplays(
        projectTasksArray,
        projectIndex,
      );
      addTaskDialog.close();
      taskForm.reset();
      return;
    }

    if (projectIndex == 0) {
      const newTask = createNewTaskObject(projectName, projectIndex);
      taskManager.addTaskItemToArray(newTask);
      displayController.updateInboxTasksDisplay();
      addTaskDialog.close();
      taskForm.reset();
    }
  });

  tasksContainer.addEventListener('click', (event) => {
    const { target } = event;
    const taskItem = target.parentElement;
    const classNames = [
      'task-check-button',
      'task-edit-button',
      'task-delete-button',
    ];

    if (target.classList.contains('task-check-button')) {
      taskManager.toggleTaskCompleteStatus(target.parentElement);

      if (displayController.isProjectTab()) {
        const taskElement = target.parentElement;
        const taskIndex = taskElement.dataset.number;
        let projectIndex = taskManager.getTaskProjectIndex(taskIndex);
        const projectTasksArray =
          taskManager.getProjectTasksArray(projectIndex);
        projectIndex--;
        displayController.checkRenderingCondition(
          projectTasksArray,
          projectIndex,
        );
        return;
      }

      displayController.checkRenderingCondition();
      return;
    }

    if (target.classList.contains('task-edit-button')) {
      addTaskDialog.showModal();
      taskEditMode = true;

      taskDialogHeading.textContent = 'Edit Task';
      taskSubmitButton.value = 'Edit Task';
      const taskIndex = taskItem.dataset.number;
      taskManager.setTaskToEditMode(taskIndex);
      const taskInputFieldsList =
        document.querySelectorAll('.task-input-field');
      const taskEditDetails = taskManager.getTaskEditDetails(taskIndex);

      for (let i = 0; i < taskInputFieldsList.length; i++) {
        taskInputFieldsList[i].value = taskEditDetails[i].value;
      }

      return;
    }

    if (target.classList.contains('task-delete-button')) {
      const taskIndex = taskItem.dataset.number;
      let projectIndex = taskManager.getTaskProjectIndex(taskIndex);
      taskManager.deleteTaskByTaskIndex(taskIndex);
      taskManager.updateAllArrays();
      const projectTasksArray = taskManager.getProjectTasksArray(projectIndex);
      projectIndex--;
      displayController.checkRenderingCondition(
        projectTasksArray,
        projectIndex,
      );
    }

    if (
      taskItem.classList.contains('task-item') &&
      !classNames.some((className) => target.classList.contains(className))
    ) {
      const taskIndex = taskItem.dataset.number;
      const taskItemElement = taskItem;
      const detailsContainer = taskItemElement.nextElementSibling;

      if (
        detailsContainer &&
        detailsContainer.classList.contains('detail-container')
      ) {
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

      if (
        detailsContainer &&
        detailsContainer.classList.contains('detail-container')
      ) {
        detailsContainer.remove();
      } else {
        const taskDetails = taskManager.getTaskDetails(taskIndex);
        displayController.renderTaskDetails(taskDetails, taskItemElement);
      }
    }
  });

  navBar.addEventListener('click', (event) => {
    const { target } = event;
    const projectElement = event.target.closest('.project-tab');

    if (target.classList.contains('project-edit-button')) {
      addProjectDialog.showModal();
      projectEditMode = true;

      projectDialogHeading.textContent = 'Edit Project';
      projectSubmitButton.value = 'Edit Project';
      const projectTab = target.parentElement;
      const projectIndex = projectTab.dataset.number;
      projectManager.setProjectObjectToEditMode(projectIndex);
      const projectName =
        projectManager.getProjectNameByProjectIndex(projectIndex);

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

      displayController.updateInboxTasksDisplay();
      return;
    }

    if (projectElement) {
      const taskProjectIndex = projectElement.dataset.number;
      const projectNameIndex =
        projectManager.getProjectNameIndex(taskProjectIndex);

      const projectTasksArray =
        taskManager.getProjectTasksArray(taskProjectIndex);

      displayController.updateProjectTaskDisplays(
        projectTasksArray,
        projectNameIndex,
      );
    }
  });

  inboxNavButton.addEventListener('click', () =>
    displayController.updateInboxTasksDisplay(),
  );

  todayNavButton.addEventListener('click', () =>
    displayController.updateTodayTasksDisplay(),
  );

  thisWeekNavButton.addEventListener('click', () =>
    displayController.updateThisWeekTasksDisplay(),
  );

  completeNavButton.addEventListener('click', () =>
    displayController.updateCompleteTasksDisplay(),
  );

  function createNewTaskObject(projectName, projectIndex) {
    const taskTitleValue = document.querySelector('.task-title-input').value;
    const taskDescriptionValue = document.querySelector(
      '.task-description-input',
    ).value;
    const dueDateValue = document.querySelector('.due-date-input').value;
    const priorityValue = document.querySelector('.priority-input').value;

    return taskManager.createTaskItem(
      taskTitleValue,
      taskDescriptionValue,
      dueDateValue,
      priorityValue,
      projectName,
      projectIndex,
    );
  }

  function createNewProjectObject() {
    const newProjectNameValue = document.querySelector(
      '.project-name-input',
    ).value;
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

(function defaultStart() {
  if (!localStorage.getItem('inboxTasksArray')) {
    displayDefaultTasks();
  } else {
    const inboxTasksArray =
      localStorageManager.loadTasksArrayFromLocalStorage();
    const projectsArray =
      localStorageManager.loadProjectsArrayFromLocalStorage();
    taskManager.updateIndoxTasksArray(inboxTasksArray);
    projectManager.updateProjectsArray(projectsArray);
    displayController.renderProjectsDisplay(projectsArray);
    displayController.updateProjectSelections();
    displayController.updateInboxTasksDisplay();
  }

  function displayDefaultTasks() {
    const seventhDay = new Date();
    seventhDay.setDate(seventhDay.getDate() + 7);

    const sampleProject = projectManager.createProjectObject(
      'The Most Amazing Project',
    );
    const sampleTaskOne = taskManager.createTaskItem(
      'Feed Cat',
      'Remember to let it drink enough water',
      new Date(),
      'low',
      'Inbox',
      0,
    );
    const sampleTaskTwo = taskManager.createTaskItem(
      'Do Leetcode Ex',
      'Make notes after completing the exercise',
      seventhDay,
      'medium',
      'Inbox',
      0,
    );
    const sampleTaskThree = taskManager.createTaskItem(
      'Be The Best Self Everyday',
      'You Are Awesome!!',
      '',
      'high',
      'The Most Amazing Project',
      1,
    );

    taskManager.addTaskItemToArray(sampleTaskOne);
    taskManager.addTaskItemToArray(sampleTaskTwo);
    taskManager.addTaskItemToArray(sampleTaskThree);

    projectManager.addProjectObjectToArray(sampleProject);

    const newProjectsArray = projectManager.getProjectArray();
    displayController.renderProjectsDisplay(newProjectsArray);

    displayController.updateProjectSelections();
    displayController.updateInboxTasksDisplay();
  }
})();
