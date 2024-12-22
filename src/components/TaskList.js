import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Task List</h1>
      <Link to="/add-task">Add Task</Link>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
            <Link to={`/edit-task/${task._id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
