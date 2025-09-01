
import './App.css'
import { DataTable } from './components/UI/DataTable';
import { NavBar } from './components/UI/NavBar'
import { Statics } from './components/UI/Statics';
import { Provider } from 'react-redux';
import { store } from './components/store/storeCofig';
function App() {

  return (
    <Provider store={store}>
      <div className="m-0 bg-primary">
        <NavBar />
        <Statics />
        <DataTable />
      </div>
    </Provider>
  );
}

export default App
