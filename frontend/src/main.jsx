import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AuthChecker from "./components/AuthChecker.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider.jsx";
import { AppContextProvider } from "./contexts/AppContext.jsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <PersistGate persistor={persistor}>
                <Provider store={store}>
                    <ThemeProvider>
                        <AppContextProvider>
                            <Router>
                                <AuthChecker />
                                <ScrollToTop />
                                <AppRoutes />
                            </Router>
                        </AppContextProvider>
                    </ThemeProvider>
                </Provider>
            </PersistGate>
        </QueryClientProvider>
    </StrictMode>
);
