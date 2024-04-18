import axios from 'axios';

                                                    
const getAllpokemon = async (startId)=>{
    try {
        const promiseArr = [];
        for(let i=startId; i<startId+20; i++) {
            promiseArr.push(
                await axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`)
            );
        }
        const response = await Promise.all(promiseArr);
        return response.map((el)=>{
            return el.data

        })
    } catch(error) {
        console.log(error)
    }
}     

const getFilteredPokemon = async (startId, enCateType, totalCount) => {
    try {
        const AllTypeArr = [];
        const typeId_response = await axios.get(`https://pokeapi.co/api/v2/type/`);
        const typeId_url = typeId_response.data.results.find(el=>el.name === enCateType);
        const url_response = await axios.get(typeId_url.url)
        const typeId = url_response.data.id

        const typeData = await axios.get(`https://pokeapi.co/api/v2/type/${typeId}`)
        AllTypeArr.push(typeData.data);

        const ResArr = [];
        let i = startId;
        while (ResArr.length < 20 && i < totalCount) {
            ResArr.push(AllTypeArr[0].pokemon[i].pokemon.url);
            i++;
        }

        if (ResArr.length === 0) {
            console.log("No more Pokémon data available");
            return [];
        }
        const pokeUrls = await Promise.all(ResArr);
        const pokemonDataPromises = pokeUrls.map(async (el) => {
            const results = await axios.get(el);
            return results.data;
        });

        const filteredPokemon = await Promise.all(pokemonDataPromises);
        return filteredPokemon;
        
        
    } catch (error) {
        console.log(error);
    }
};

const getPokemonSpecies = async (url)=>{
    const response = await axios.get(url);
    return response.data
    // 返回這隻寶可夢的種族資料(包含名字)
}

const getPokemonType = async (types,lang)=>{
    const renderedTypePromises = types.map(async (item)=>{
        const response = await axios.get(item.type.url);
        const translatedType = response.data.names.find(type=>type.language.name === lang).name;
        return translatedType
    })
    const renderedType = await Promise.all(renderedTypePromises);
    return renderedType
}

const fetchTypeTotalCount = async (filterType) => {
    if (filterType) {
        try {
            const typeId_response = await axios.get(`https://pokeapi.co/api/v2/type/`);
            const typeId_url = typeId_response.data.results.find(el => el.name === filterType);
            const url_response = await axios.get(typeId_url.url);
            return url_response.data.pokemon.length
        } catch (error) {
            console.log(error);
        }
    }
};

const fetchTotalCount = async () => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/type/`);
        const urlArr = []
        response.data.results.map((el)=>{
            return urlArr.push(el.url)
        })
        
        const allTypesLength = urlArr.map(async(url)=>{
            const urlData = await axios.get(url)
            return urlData.data.pokemon.length
        })
        const renderedLength = await Promise.all(allTypesLength);
        const total = Object.values(renderedLength).reduce((a, b) => a + b, 0);

        return total
    } catch (error) {
        console.log(error);
    }
};

export { getAllpokemon, getPokemonSpecies, getPokemonType, getFilteredPokemon, fetchTypeTotalCount, fetchTotalCount };