import PokeItem from "./PokeItem";
import Skeleton from "./Skeleton";
import { getAllpokemon, getPokemonSpecies, getPokemonType, getFilteredPokemon, fetchTypeTotalCount, fetchTotalCount } from '../api/getPokeApi';
import { useEffect, useState } from 'react';
import typeColor from "./typeColor";
import classNames from "classnames";

function PokeList() {
    const [pokeData, setPokeData] = useState([]); //全部資料
    const [filterData, setFilterData] = useState([]); //有篩選的顯示資料
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState(''); //有沒有篩選、篩選的類別

    const [isActive, setIsActive] = useState(null); //按鈕active

    const typeColors = typeColor();

    const [totalCount, setTotalCount] = useState(0);
    const [loadedCount, setLoadedCount] = useState(0);

    const startId = 1;
    const lang = "zh-Hant";
    const fetchAllCount = async () => {
        return await fetchTotalCount();
    }
    const allCount = async () => {
        const number = await fetchAllCount();
        return number
    }


    useEffect(() => {
        const getCount = async ()=> {
            const totalCount = await fetchTypeTotalCount(filterType);
            setTotalCount(totalCount);

        }
        setLoadedCount(0)
        getCount();

    }, [filterType]);

     window.onscroll = async () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            if (filterData.length <= totalCount) {
                
                const newStartId = (pokeData.length) + 1;
                const newStartId_fiter = (filterData.length) + 1;
                let updatedData;
                if (filterType) {
                    updatedData = await getFilteredPokemon(newStartId_fiter, filterType, totalCount);
                } else {
                    updatedData = await getAllpokemon(newStartId);
                }
    
                const updateLoad = await loadPokemon(updatedData);
                if (updateLoad.length) {
                    setIsLoading(true);
                    
                    setPokeData([...pokeData, ...updateLoad]);
                    setLoadedCount(filterData.length + updateLoad.length);
    
                    setFilterData([...filterData, ...updateLoad])
    
                    const timer = setTimeout(() => {
                        setIsLoading(false);
                    }, 1200);
                    return () => clearTimeout(timer);
                } else {
                    setIsLoading(false);
                }
            }
         
        }
    };
    

    const loadPokemon = async (data)=>{
        const renderedData = await Promise.all(
            data.map(async (item)=>{
                // 返回的item obj裡面的url裡才有我們要的全部名稱資訊
                const pokemonSpeciesData = await getPokemonSpecies(item.species.url);
                const pokemonName = pokemonSpeciesData.names;
                const pokemonImg = item.sprites?.front_default;
                const pokemonType = await getPokemonType(item.types,lang);
                let pokdId = pokemonImg?.substring(pokemonImg.lastIndexOf('/') + 1);
                pokdId = pokdId?.replace(/\.[^/.]+$/, "")
                return {
                    id: pokdId,
                    pokemonName,
                    pokemonImg,
                    pokemonType,
                   
                }
            })
        )
        return renderedData
    }
    
    useEffect(()=>{
        setIsLoading(true)
        const fetchData = async ()=>{
            const allPokemonData = await getAllpokemon(startId)
            const renderedResults = await loadPokemon(allPokemonData)
            allCount().then(num => { 
                setTotalCount(num);
            });
            setPokeData(renderedResults);
        }
        fetchData();
        setIsLoading(false)
    },[])
    
    const loadingSign = <div className="loading-sign mt-8">
        <div className="grid grid-cols-4 gap-8">
            <Skeleton box={8} className='h-80' />
        </div>
    </div>


    const handleFilterCate = async (cateType, enCateType) => {
        setFilterType('');
        setIsLoading(true);
        setFilterType(enCateType);
        if (enCateType) {
            try {
                const filteredPokemon = await getFilteredPokemon(startId, enCateType.toLowerCase(), totalCount);
                const updatedLoad = await loadPokemon(filteredPokemon);
    
                setFilterData(updatedLoad);
                setIsLoading(false);
    
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (isActive !== null) {
            setIsLoading(true);
            const filterKey = Object.keys(typeColors)[isActive];
            const filterValue = Object.values(typeColors)[isActive];
            handleFilterCate(filterKey, filterValue);
        } else {
            setIsLoading(true);
            setFilterType('');
            setIsLoading(false);
            allCount().then(num => { 
                setLoadedCount(0)
                setTotalCount(num);
            });

        }

    }, [isActive]);

    const handleActive = (index) => {
        setIsActive((prevActiveButton) => {
            return prevActiveButton === index ? null : index;
        });
    };

    return (
        <div className='container mx-auto px-2 md:px-0 py-5'>
            <div className="text-right">
                <h2 className="text-3xl uppercase font-bold mt-10 mb-2">my PokeBook</h2>
                <span className="tracking-wide capitalize">{filterType || '迷你抓寶箱'}</span>
            </div>
            <div className="cate-box md:grid md:grid-rows-2 flex flex-nowrap grid-flow-col gap-3 mt-8 mb-12">
                {
                    Object.entries(typeColors).map(([key, value],index) => (
                        <button 
                            id={index}
                            key={index}
                            onClick={() => {
                                // handleFilterCate(key, value);
                                handleActive(index,value); // Call handleActive when the button is clicked
                            }}
                            className={classNames(`bg-${value} type-badge shrink-0`, {
                                'active': isActive === index && isActive !== null,
                                'inactive': isActive !== index && isActive !== null,
                            })}
                            type="button"
                        >
                            {key}系
                        </button>
                    ))
                }
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 md:gap-8 gap-4'>

                {filterType ? (
                    filterData.map((el) => (
                        <PokeItem key={el.id} pokeId={el.id} pokemonName={el.pokemonName} pokemonImg={el.pokemonImg} pokemonType={el.pokemonType} />
                    ))
                )
                : (
                    pokeData.map((el) => (
                        <PokeItem key={el.id} pokeId={el.id} pokemonName={el.pokemonName} pokemonImg={el.pokemonImg} pokemonType={el.pokemonType} />
                    ))
                )}
            </div>
            {isLoading && loadingSign}
        </div>
    )
}

export default PokeList;