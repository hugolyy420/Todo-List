import * as dateFns from "date-fns";
//create a factory function to make task item

//loop through inboxTasksArray and look for objects that match the condition
// assign it a property that references the index
// render the table by giving the dom element an id corresponding the index

//if mark complete skip render
//push the object into completetaskArray
//display object with complete status in complete tab

export const taskManager = (() => {

    let inboxTasksArray = [];
    let todayTasksArray = [];
    let thisWeekTasksArray = [];
    let completeTasksArray = [];

    const createTaskItem = function (title, description, dueDate, priority) {

        const formattedDueDate = dateFns.format(dueDate, 'dd MMMM yyyy');

        return { title, description, formattedDueDate, priority, complete: false };
    }

    const createTodayTasksArray = function () {
        
        todayTasksArray = [];

        for (let i = 0; i < inboxTasksArray.length; i++) {

            if (inboxTasksArray[i].formattedDueDate === dateFns.format(new Date(), 'dd MMMM yyyy')) {

                inboxTasksArray[i].id = i;
                todayTasksArray.push(inboxTasksArray[i]);

            }

        }

    };

    const createThisWeekTasksArray = function () {

        thisWeekTasksArray = [];

        const seventhDay = new Date ();
        seventhDay.setDate(seventhDay.getDate() + 7);

        for (let i = 0; i < inboxTasksArray.length; i++) {

            if (new Date(inboxTasksArray[i].formattedDueDate).getDate() <= seventhDay.getDate() && new Date(inboxTasksArray[i].formattedDueDate).getDate() >= new Date().getDate()) {

                inboxTasksArray[i].id = i;
                thisWeekTasksArray.push(inboxTasksArray[i]);

            }

        }

    }

    const createCompletetaskArray = function () {

        completeTasksArray = [];

        for (let i = 0; i < inboxTasksArray.length; i++) {

            if (inboxTasksArray[i].complete) {

                inboxTasksArray[i].id = i;
                completeTasksArray.push(inboxTasksArray[i]);

            }

        }

    }

    const getInboxTaskArray = () => inboxTasksArray;

    const getTodayTasksArray = () => todayTasksArray;

    const getThisWeekTasksArray = () => thisWeekTasksArray;

    const getCompleteTasksArray = () => completeTasksArray;

    const addTaskItemToArray = (task) => inboxTasksArray.push(task);

    const toggleTaskCompleteStatus = function (taskElement) {

        const taskObjectIndex = taskElement.dataset.number
        const isComplete = inboxTasksArray[taskObjectIndex].complete

        inboxTasksArray[taskObjectIndex].complete = isComplete ? false : true ;

        console.log(inboxTasksArray[taskObjectIndex]);

    } 

    return { createTaskItem, createTodayTasksArray, createThisWeekTasksArray, getInboxTaskArray, addTaskItemToArray, getTodayTasksArray, getThisWeekTasksArray, toggleTaskCompleteStatus, createCompletetaskArray, getCompleteTasksArray };

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