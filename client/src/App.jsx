import { Route, Routes } from 'react-router-dom';
import './App.css';
import Authlayout from './components/auth/layout';
import AuthLogin from './pages/auth/login';
import AuthRegister from './pages/auth/register';
import SubjectPage from './pages/auth/main/subject';
import ChapterPage from './pages/auth/main/chapters';
import NotesPage from './pages/auth/main/notes';
import NotFound from './pages/auth/not-found';
import MainLayout from './components/main/mainlayout';
import CheckAuth from './components/common/checkAuth';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './../store/auth-slice/index';
import Home from './pages/auth/home';
import AddNote from './components/main/add-note';
import ViewNote from './components/main/view-note';
import GoogleLogins from './components/auth/googleLogin';
import { LoadingBig } from './components/common/loadingBig';
import FloatingChatButton from './components/common/floatingBtn';
import Chatbot from './pages/auth/chatbox';


function App() {
  const { isAuthenticated, user, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token'));
    dispatch(checkAuth(token));
  }, [dispatch]);



  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-200 via-white to-orange-100">
        <LoadingBig />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/google-login" element={<GoogleLogins />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <Authlayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/dashboard"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <MainLayout />
            </CheckAuth>
          }
        >
          <Route path="subject" element={<SubjectPage />} />
          <Route path="chapter/:subjectId" element={<ChapterPage />} />
          <Route path="notes/:chapterId" element={<NotesPage />} />
        </Route>
        <Route
          path="/notes/add/:chapterId"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AddNote />
            </CheckAuth>
          }
        />
        <Route
          path="/notes/view/:noteId"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ViewNote />
            </CheckAuth>
          }
        />
        <Route path="/chatbot" element={<CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <Chatbot/>

        </CheckAuth>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>

    
      <FloatingChatButton />
    </>
  );
}

export default App;
