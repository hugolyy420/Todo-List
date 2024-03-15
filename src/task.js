import * as dateFns from "date-fns";
import { localStorageManager } from "./localStorage";

export const taskManager = (() => {

    let inboxTasksArray = [];
    let todayTasksArray = [];
    let thisWeekTasksArray = [];
    let completeTasksArray = [];

    const createTaskItem = function (title, description, dueDate, priority, projectName, projectIndex) {

        console.log(dueDate);
        const formattedDueDate = formateDate(dueDate);

        return { title, description, formattedDueDate, priority, complete: false, edit: false, projectName, projectIndex };
    }

    const updateAllArrays = function () {
        
        todayTasksArray = [];
        thisWeekTasksArray = [];
        completeTasksArray = [];
    
        const seventhDay = new Date ();
        seventhDay.setDate(seventhDay.getDate() + 7);


        for (let i = 0; i < inboxTasksArray.length; i++) {

            inboxTasksArray[i].taskIndex = i;
            console.log(inboxTasksArray[i]);

            if (inboxTasksArray[i].formattedDueDate === dateFns.format(new Date(), 'dd MMMM yyyy')) {

                
                todayTasksArray.push(inboxTasksArray[i]);

            }  
            
            if (new Date(inboxTasksArray[i].formattedDueDate).getDate() <= seventhDay.getDate() && new Date(inboxTasksArray[i].formattedDueDate).getDate() >= new Date().getDate()) {

                
                thisWeekTasksArray.push(inboxTasksArray[i]);

            }  
            
            if (inboxTasksArray[i].complete) {

                
                completeTasksArray.push(inboxTasksArray[i]);

            }

        }

    };

    const getInboxTasks = () => inboxTasksArray.filter(task => task.projectIndex == 0);
    
    const getTaskDetails = function (taskIndex) {

        const taskObject = inboxTasksArray[taskIndex];
        const detailsArray = [
            { label: 'Title', value: taskObject.title },
            { label: 'Description', value: taskObject.description },
            { label: 'Due Date', value: taskObject.formattedDueDate },
            { label: 'Priority', value: taskObject.priority }
        ];
        return detailsArray;

    } 

    const getTaskEditDetails = function (taskIndex) {

        const taskObject = inboxTasksArray[taskIndex];
        const formattedDueDate = taskObject.formattedDueDate !== "" ? dateFns.format(taskObject.formattedDueDate, 'yyyy-MM-dd') : "";

        const detailsArray = [
            { value: taskObject.title },
            { value: taskObject.description },
            { value: formattedDueDate },
            { value: taskObject.priority },
            { value: taskObject.projectName }
        ];
        console.log (detailsArray);
        return detailsArray;

    }

    const getInboxTasksArray = () => inboxTasksArray;

    const getTodayTasksArray = () => todayTasksArray;

    const getThisWeekTasksArray = () => thisWeekTasksArray;

    const getCompleteTasksArray = () => completeTasksArray;

    const getProjectTasksArray = (projectIndex) => inboxTasksArray.filter(task => task.projectIndex == projectIndex);

    const addTaskItemToArray = (task) =>  {

        inboxTasksArray.push(task);
        localStorageManager.saveTasksArrayToLocalStorage(inboxTasksArray);

    } 

    const toggleTaskCompleteStatus = function (taskElement) {

        const taskObjectIndex = taskElement.dataset.number
        const isComplete = inboxTasksArray[taskObjectIndex].complete

        inboxTasksArray[taskObjectIndex].complete = isComplete ? false : true ;

        localStorageManager.saveTasksArrayToLocalStorage(inboxTasksArray);

    } 

    const formateDate = (dueDate) => dueDate === "" ? "" : dateFns.format(dueDate, 'dd MMMM yyyy');

    const deleteTasksByProjectIndex = (projectIndex) => inboxTasksArray.forEach((task, index) => {

        if (task.projectIndex == projectIndex) {

            inboxTasksArray.splice(index, 1);

        }

        localStorageManager.saveTasksArrayToLocalStorage(inboxTasksArray);

    });

    const deleteTaskByTaskIndex = (taskIndex) =>  {

        inboxTasksArray.splice(taskIndex, 1);
        localStorageManager.saveTasksArrayToLocalStorage(inboxTasksArray);

    } 

    const getTaskProjectIndex = (taskIndex) => inboxTasksArray[taskIndex].projectIndex;

    const setTaskToEditMode = (taskIndex => inboxTasksArray[taskIndex].edit = true);

    const getTaskObjectInEditMode = () => inboxTasksArray.find(task => task.edit);

    const updateTaskDetails = function (newTaskObject) {

        const taskIndex = inboxTasksArray.findIndex(task => task.edit);
        inboxTasksArray[taskIndex] = newTaskObject;
        localStorageManager.saveTasksArrayToLocalStorage(inboxTasksArray);

    }

    const updateIndoxTasksArray = (storedArray) => inboxTasksArray = storedArray;

    return { createTaskItem, updateAllArrays, getInboxTasks, addTaskItemToArray, getTodayTasksArray, getThisWeekTasksArray, toggleTaskCompleteStatus, getCompleteTasksArray, getProjectTasksArray, getTaskDetails, deleteTasksByProjectIndex, getTaskEditDetails, getTaskProjectIndex, setTaskToEditMode, getTaskObjectInEditMode, updateTaskDetails, deleteTaskByTaskIndex, getInboxTasksArray, updateIndoxTasksArray };
    
})();