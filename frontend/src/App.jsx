import { useDispatch } from 'react-redux';
import './App.css';
import AppRouter from './AppRouter';
import NavigationBar from './components/navigation-bar/NavigationBar';
import NotificationBar from './components/notification-bar/NotificationBar';
import { useEffect } from 'react';
import { statusThunk } from './store/actionCreators/thunks/Auth';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(statusThunk());
  }, []);

  return (
    <div className="App">
      <NavigationBar/>
      <NotificationBar/>
      <AppRouter/>
    </div>
  );
}

export default App;
