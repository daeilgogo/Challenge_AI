import { Routes,Route,BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import { AuthContextProvider } from './context/AuthContext';
import Protected from './components/Protected';
import GraphicPage from './pages/GraphicPage';
import RatingPage from './pages/RatingPage';
import ChatPage from './pages/ChatPage';
import CategoryPage from './pages/CategoryPage';
import SettingDebatePage from './pages/SettingDebatePage';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
         <Routes>
           <Route path='/' element={<LoginPage/>}/>
           <Route path='/home' element={<Protected><Home/></Protected>}/>
           <Route path='/category' element={<Protected><CategoryPage/></Protected>}/>
           <Route path='/setting' element={<Protected><SettingDebatePage/></Protected>}/>
           <Route path='/grap' element={<Protected><GraphicPage/></Protected>}/>
           <Route path='/rating' element={<Protected><RatingPage/></Protected>}/>
           <Route path='/chat' element={<Protected><ChatPage/></Protected>}/>
         </Routes>
      </BrowserRouter>
    </AuthContextProvider>
      
    
  );
}

export default App;