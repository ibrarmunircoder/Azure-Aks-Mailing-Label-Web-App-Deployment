import { SidebarRoot } from "components";
import { AuthContextContainer } from "context";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { Routes } from "routes";
import "styles/fonts/gotham-book/gotham-book.css";
import "styles/fonts/kepler-std-regular/kepler-std-regular.css";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <SidebarRoot />
      <AuthContextContainer>
        <Routes />
      </AuthContextContainer>
    </BrowserRouter>
  );
};

export default App;
