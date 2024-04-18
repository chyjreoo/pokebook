import PokeList from "./components/PokeList";
import FavList from "./components/FavList";
import { Provider } from "./context/provider";

function App() {
  return (
    <Provider>
        <PokeList />
        <FavList />
    </Provider>
  );
}

export default App;
