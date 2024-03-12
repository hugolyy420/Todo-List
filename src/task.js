import * as dateFns from "date-fns";

export const taskManager = (() => {

    let inboxTasksArray = [];
    let todayTasksArray = [];
    let thisWeekTasksArray = [];
    let completeTasksArray = [];

    const createTaskItem = function (title, description, dueDate, priority) {

        const formattedDueDate = formateDate(dueDate);

        return { title, description, formattedDueDate, priority, complete: false };
    }

    const updateAllArrays = function () {
        
        todayTasksArray = [];
        thisWeekTasksArray = [];
        completeTasksArray = [];
        
        const seventhDay = new Date ();
        seventhDay.setDate(seventhDay.getDate() + 7);


        for (let i = 0; i < inboxTasksArray.length; i++) {

            inboxTasksArray[i].id = i;
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

    const getInboxTaskArray = () => inboxTasksArray;

    const getTodayTasksArray = () => todayTasksArray;

    const getThisWeekTasksArray = () => thisWeekTasksArray;

    const getCompleteTasksArray = () => completeTasksArray;

    const addTaskItemToArray = (task) => inboxTasksArray.push(task);

    const toggleTaskCompleteStatus = function (taskElement) {

        const taskObjectIndex = taskElement.dataset.number
        const isComplete = inboxTasksArray[taskObjectIndex].complete

        inboxTasksArray[taskObjectIndex].complete = isComplete ? false : true ;

    } 

    const formateDate = (dueDate) => dueDate === "" ? "" : dateFns.format(dueDate, 'dd MMMM yyyy');

    return { createTaskItem, updateAllArrays, getInboxTaskArray, addTaskItemToArray, getTodayTasksArray, getThisWeekTasksArray, toggleTaskCompleteStatus, getCompleteTasksArray };

})();

//create an inbox array and push the task item into the array

// export const taskManager = (() => {

//     let inboxTasksArray = [];
//     let todayTasksArray = [];
//     let thisWeekTasksArray= [];

//     const createTaskItem = function (title, description, dueDate, priority) {

//         const formattedDueDate = dateFns.format(dueDate, 'dd MMMM yyyy');

//         return { title, description, formattedDueDate, priority, complete: false };
//     }

//     const createTodayTasksArray = function () {
        
//         todayTasksArray = inboxTasksArray.filter((task) => task.formattedDueDate === dateFns.format(new Date(), 'dd MMMM yyyy'))

//     };

//     const createThisWeekTasksArray = function (array) {

//         const seventhDay = new Date ();
//         seventhDay.setDate(seventhDay.getDate() + 7);

//         thisWeekTasksArray = inboxTasksArray.filter((task) => new Date (task.formattedDueDate).getDate() <= seventhDay.getDate());

//         console.log(thisWeekTasksArray);

//     }

//     const getInboxTaskArray = () => inboxTasksArray;

//     const getTodayTasksArray = () => todayTasksArray;

//     const getThisWeekTasksArray = () => thisWeekTasksArray;

//     const addTaskItemToArray = (task) => inboxTasksArray.push(task);

//     return { createTaskItem, createTodayTasksArray, createThisWeekTasksArray, getInboxTaskArray, addTaskItemToArray, getTodayTasksArray, getThisWeekTasksArray  };

// })();