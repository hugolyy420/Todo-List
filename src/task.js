import * as dateFns from "date-fns";
//create a factory function to make task item

export const taskManager = (() => {

    const inboxTasksArray = [];

    const createTaskItem = function (title, description, dueDate, priority) {

        const formattedDueDate = dateFns.format(dueDate, 'dd MMMM yyyy');

        return { title, description, formattedDueDate, priority, complete: false };
    }

    const getInboxTaskArray = () => inboxTasksArray;

    const addTaskItemToArray = (task) => inboxTasksArray.push(task);

    const getTodayTasksArray = (array) => array.filter((task) => task.formattedDueDate === dateFns.format(new Date(), 'dd MMMM yyyy'));

    const getThisWeekTasksArray = function (array) {

        const seventhDay = new Date ();
        seventhDay.setDate(seventhDay.getDate() + 7);

        return array.filter((task) => new Date (task.formattedDueDate).getDate() <= seventhDay.getDate());

    }

    return { createTaskItem, getInboxTaskArray, addTaskItemToArray, getTodayTasksArray, getThisWeekTasksArray };

})();

//create an inbox array and push the task item into the array

