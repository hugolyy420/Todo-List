import { localStorageManager } from "./localStorage";

export const projectManager = (() => {

    let projectsArray = [];

    const createProjectObject = function (projectName) {

        const projectObject = {

            name : projectName,
            edit : false

        }
        return projectObject;

    }

    const addProjectObjectToArray = (project) => {
        
        projectsArray.push(project);
        localStorageManager.saveProjectsArrayToLocalStorage(projectsArray);

    };

    const getProjectArray = () => projectsArray;

    const getEachProjectName = () => projectsArray.map(project => project.name);

    const getProjectNameByProjectIndex = (projectIndex) => projectsArray[projectIndex - 1].name;

    const getProjectNameIndex = (index) => index - 1;

    const getEditModeProjectIndex = () => projectsArray.findIndex(project => project.edit) + 1;

    const setProjectObjectToEditMode = (projectIndex) => projectsArray[projectIndex - 1].edit = true;

    const setNewProjectName = function (NewprojectName) {

        const projectObjectInEditMode = projectsArray.find(project => project.edit)
        projectObjectInEditMode.name = NewprojectName;
        projectObjectInEditMode.edit = false;
        localStorageManager.saveProjectsArrayToLocalStorage(projectsArray);

    }

    const deleteProjectByProjectIndex = (projectIndex) => {

        projectsArray.splice(projectIndex - 1, 1);
        localStorageManager.saveProjectsArrayToLocalStorage(projectsArray);

    } 

    const getProjectObjectInEditMode = () => projectsArray.find(project => project.edit);

    const updateProjectsArray = (storedArray) => projectsArray = storedArray;


    return {createProjectObject, getProjectArray, addProjectObjectToArray, getEachProjectName, getProjectNameIndex, getProjectNameByProjectIndex, setProjectObjectToEditMode, setNewProjectName, deleteProjectByProjectIndex, getEditModeProjectIndex, getProjectObjectInEditMode, updateProjectsArray};

})();

