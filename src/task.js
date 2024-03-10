import * as dateFns from "date-fns";
//create a factory function to make task item

export const taskManager = (() => {

    const inboxTasksArray = [];
    const todayTasksArray = [];
    const thisWeekTasksArray = [];
    const completedTasksArray = [];


    const createTaskItem = function (title, description, dueDate, priority) {

        const formattedDueDate = dateFns.format(dueDate, 'dd MMMM yyyy');

        return { title, description, formattedDueDate, priority, complete: false };
    }

    const getInboxTaskArray = () => inboxTasksArray;

    const addTaskItemToArray = (task) => inboxTasksArray.push(task);

    const getTodayTasksArray = (array) => array.filter((task) => task.formattedDueDate === dateFns.format(new Date(), 'dd MMMM yyyy'));

    return { createTaskItem, getInboxTaskArray, addTaskItemToArray, getTodayTasksArray };

})();

//create an inbox array and push the task item into the array

