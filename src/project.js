import { taskManager } from "./task";

//function for getting each project name
//for loop and push each pj name into an array
//function for getting the name array
// => so user can select project where the task goes to
//function to assign task object to corresponding project tasks array after receiving user input
//function 

export const projectManager = (() => {

    let projectsArray = [];

    const createProjectObject = function (projectName) {

        const projectObject = {

            name : projectName,
            edit : false

        }
        return projectObject;

    }

    const addProjectObjectToArray = (project) => projectsArray.push(project);

    const getProjectArray = () => projectsArray;

    const getEachProjectName = () => projectsArray.map(project => project.name);

    const getProjectNameByProjectIndex = (projectIndex) => projectsArray[projectIndex - 1].name;

    const getProjectNameIndex = (index) => index - 1;

    const setProjectObjectToEditMode = (projectIndex) => projectsArray[projectIndex - 1].edit = true;

    const setNewProjectName = function (NewprojectName) {

        const projectObjectInEditMode = projectsArray.find(project => project.edit)
        projectObjectInEditMode.name = NewprojectName;

    }

    return {createProjectObject, getProjectArray, addProjectObjectToArray, getEachProjectName, getProjectNameIndex, getProjectNameByProjectIndex, setProjectObjectToEditMode, setNewProjectName};

})();

