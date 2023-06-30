import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
// import localforage from "localforage";

function App({db}) {
  useEffect(()=>{
    // localforage.getItem('tasks', (err, tasks)=>{
    //   if(tasks){
    //     setTasks(tasks);
    //   }
    // })
    db.collection('tasks').doc('first').get().then((doc)=>{
      if(doc.data().tasks){
        setTasks(doc.data().tasks);
      }
    })
  }, [])
  const [task, setTask] = useState({ name: "", completed: false });
  const [tasks, setTasks] = useState([]);
  const changeHandler = (event) => {
    setTask(event.target.value);
  };
  const storeTasks = (tasks)=>{
    setTasks(tasks);
    // localforage.setItem('tasks', tasks, (err)=>{
    //   console.log("tasks saved")
    // })
    db.collection('tasks').doc('first').set({
      tasks: tasks
    })
  }
  const addTask = (t) => {
    if (task.length !== 0) {
      const newTasks = [...tasks];
      newTasks.push({ name: t, completed: false });
      storeTasks(newTasks);
      setTask({ name: "", completed: false });
    } else {
      alert("Please enter valid input, Input can not be empty!!");
    }
  };
  const updateHandler = (i) => {
    const newTasks = [...tasks];
    newTasks.splice(i, 1, {
      name: newTasks[i].name,
      completed: !newTasks[i].completed,
    });
    storeTasks(newTasks);
  };
  const deleteHandler = (i) => {
    const newTasks = [...tasks];
    newTasks.splice(i, 1);
    storeTasks(newTasks);
  };
  const getTasks = () => {
    return tasks.map((task, index) => (
      <li
        key = {index}
        className={
          task.completed
            ? "list-group-item list-group-item-info user-select-none"
            : "list-group-item list-group-item-danger user-select-none"
        }
        onDoubleClick={() => deleteHandler(index)}
        onClick={() => updateHandler(index)}
      >
        {task.name}
      </li>
    ));
  };
  return (
    <div className="App">
      <h1 className="my-3 text-primary">Welcome to Todo App</h1>
      <div className="container my-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter your task"
          onChange={changeHandler}
          value={task.name}
        />
        <button className="btn btn-primary my-3" onClick={() => addTask(task)}>
          Add Work
        </button>
        <ul className="list-group">{getTasks()}</ul>
      </div>
      <div className="container my-4">
        <h4 className="text-danger user-select-none">
          Red indicates that the work is still pending!!
        </h4>
        <h4 className="text-info user-select-none">
          Blue indicates that the work is completed!!
        </h4>
      </div>
      <div className="container">
        <h5 className="user-select-none">Single click to mark the task as completed. Double click to delete the task.</h5>
      </div>
    </div>
  );
}

export default App;
