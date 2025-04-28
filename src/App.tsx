import { Provider } from "react-redux";
import "./App.css";
import AppRoutes from "./routes";
import { persistor, store } from "./shared/redux/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;
