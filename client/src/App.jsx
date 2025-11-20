// App.jsx
import AppRouter from "./routes/AppRouter";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FullScreenSpinner } from "./components/ui/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// create a React Query client
const queryClient = new QueryClient();

const AppContent = () => {
  const { hydrating } = useAuth();

  if (hydrating) {
    return <FullScreenSpinner />;
  }

  return <AppRouter />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
