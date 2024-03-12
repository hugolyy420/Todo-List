import { taskManager } from "./task";

//function for creating pj array
//function for getting the array

export const projectManager = (() => {

    let projectsArray = [];

    const createProjectObject = function (projectName) {

        const projectObject = {

            name : projectName,
            tasks : []

        }
        return projectObject;

    }

    const addProjectObjectToArray = (project) => projectsArray.push(project);

    const getProjectArray = () => projectsArray;

    return {createProjectObject, getProjectArray, addProjectObjectToArray};

})();

