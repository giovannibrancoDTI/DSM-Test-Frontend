import { Provider } from "react-redux";
import "./App.css";
import AppRoutes from "./routes";
import { store } from "./shared/redux/store";

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
