import { CardProvider } from "./contexts/CardContext";
import { ModalProvider } from "./contexts/ModalContext";
import { MainPage } from "./pages/MainPage";

function App() {
  return (
    <>
      <ModalProvider>
        <CardProvider>
          <MainPage />
        </CardProvider>
      </ModalProvider>
    </>
  );
}

export default App;
