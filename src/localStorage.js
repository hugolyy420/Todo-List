// eslint-disable-next-line import/prefer-default-export
export const localStorageManager = (() => {
  const saveTasksArrayToLocalStorage = (inboxTasksArray) => {
    localStorage.setItem("inboxTasksArray", JSON.stringify(inboxTasksArray));
  };

  const saveProjectsArrayToLocalStorage = (projectsArray) => {
    localStorage.setItem("projectsArray", JSON.stringify(projectsArray));
  };

  const loadTasksArrayFromLocalStorage = () =>
    JSON.parse(localStorage.getItem("inboxTasksArray"));

  const loadProjectsArrayFromLocalStorage = () =>
    JSON.parse(localStorage.getItem("projectsArray"));

  return {
    saveTasksArrayToLocalStorage,
    saveProjectsArrayToLocalStorage,
    loadTasksArrayFromLocalStorage,
    loadProjectsArrayFromLocalStorage,
  };
})();
