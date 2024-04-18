import { createContext, useState } from "react";

const Context = createContext()
function Provider({children}) {
    const [favData, setFavData] = useState([]);
    const [favListAni, setFavListAni] = useState(false);

    const handleAdd = (pokeId, pokemonName, pokemonImg, pokemonType)=>{
        if (!favData.find((el)=>el.pokeId === pokeId )){
            const dataToAdd = {pokeId, pokemonName, pokemonImg, pokemonType};
            const updatedData = [...favData, dataToAdd];
            setFavData(updatedData)
            setFavListAni(true)
            let aniTimeout;
            if (aniTimeout) {
                clearTimeout(aniTimeout);
            }
            
            // Set a new timeout to unset favListAni after 1000ms (1 second)
            aniTimeout = setTimeout(() => {
                setFavListAni(false);
            }, 1000);
        } 
    }
    
    const globalVal = {
        favData,
        setFavData,
        handleAdd,
        favListAni,
        setFavListAni
    }
    return (
        <Context.Provider value={globalVal}>
            {children}
        </Context.Provider>
    )
}
export { Provider };
export default Context;
