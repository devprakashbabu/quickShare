import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  let [todolist, settodolist] = useState([]);
  let saveToDoList = (event)=>{
        event.preventDefault();
        let todovalue = event.target.toname.value;
        console.log(todovalue);
        let finaltodolist = [...todolist, todovalue];
        settodolist(finaltodolist);
  }
  return (
    <div className="App">
     <h1>To do list</h1>
     <form onSubmit={saveToDoList}>
      <input type="text" name="toname"/> <button>save</button>
     </form>
     <div className="outerdiv">
     <ul>
       {todolist.map((v, i)=>{
        return(
          <TodolistItem item={v} key={i} index ={i} 
          todolist= {todolist} settodolist = {settodolist}
          />
        )
       })}
     </ul>
     </div>
    </div>
  );
}
function TodolistItem(props){
  let deleterow=()=>{
    let finalData = props.todolist.filter((v, i)=>
        i !=props.index )
       props.settodolist(finalData);
  }
  return(
    <li>{props.item}<span onClick={deleterow}>x</span></li>
  )
}
export default App;

