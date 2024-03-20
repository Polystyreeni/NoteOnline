import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Notes from "./pages/notes/Notes";
import NoteView from "./pages/note-view/NoteView";
import NotFound from "./pages/not-found/NotFound";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" Component={Home}></Route>
            <Route path="/login" Component={Login}></Route>
            <Route path="/register" Component={Register}></Route>
            <Route path="/notes" Component={Notes}></Route>
            <Route path="/notes/{:id}" Component={NoteView}></Route>
            <Route path="*" Component={NotFound}></Route>
        </Routes>
    );
}

export default AppRouter;