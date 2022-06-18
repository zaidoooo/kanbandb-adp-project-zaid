import React from 'react';
// @ts-ignore
import KanbanDB from 'kanbandb';
import KanbanList from './components/kanbanlist';
import './App.css';
import kanbanModel from './model/kanbanModel';
import { organizeKanban } from './components/organizeKanban';

async function initialize() {
  /**
   * Use KanbanDB like so (but you might want to move it) - types are provided
   * by jsconfig.json, which will utilize d.ts files and give you autocompletion for
   * KanbanDB, in Visual Studio Code, if that is your preferred IDE.
   * 
   * This code (initialize function) is for demonstration only.
   */
  const instance = await KanbanDB.connect(null);
  for (let i = 0; i < kanbanModel.length; i++) {
    // @ts-ignore
    instance.addCard(kanbanModel[i]);
  }

}

function App() {
  // Initialize DB communications.
  initialize();

  return (
    <div className="App">
      <KanbanList />
    </div>
  );
}

export default App;
