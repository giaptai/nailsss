import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "remixicon/fonts/remixicon.css";
import "react-phone-input-2/lib/style.css";
import { Provider } from "react-redux";
import { persistor, store } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistor}>
			{() => <App />}
		</PersistGate>
	</Provider>
);
