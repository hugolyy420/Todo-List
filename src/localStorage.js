export const localStorageManager = (() => {

    const saveTasksArrayToLocalStorage = (inboxTasksArray) => {

        localStorage.setItem('inboxTasksArray', JSON.stringify(inboxTasksArray));

    }

    const saveProjectsArrayToLocalStorage = (projectsArray) => {

        localStorage.setItem('projectsArray', JSON.stringify(projectsArray));

    }

    const loadTasksArrayFromLocalStorage = () => {

        return JSON.parse(localStorage.getItem('inboxTasksArray'));

    }

    const loadProjectsArrayFromLocalStorage = () => {

        return JSON.parse(localStorage.getItem('projectsArray'));

    }

    return { saveTasksArrayToLocalStorage, saveProjectsArrayToLocalStorage, loadTasksArrayFromLocalStorage, loadProjectsArrayFromLocalStorage}

})();