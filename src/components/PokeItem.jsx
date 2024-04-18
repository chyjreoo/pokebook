import './pokeItem.css';
import classNames from "classnames";
import { CgPokemon } from "react-icons/cg";
import typeColor from './typeColor';
import { useContext, useState } from 'react';
import Context from '../context/provider';

function PokeItem({ pokeId, pokemonName, pokemonImg, pokemonType }) {
    const { handleAdd, setFavListAni, favData } = useContext(Context);
    const [boxHover, setBoxHover] = useState(false);
    const [isFaved, setIsFaved] = useState(false);
    const typeColors = typeColor();
    const renderedType = pokemonType.map((el,index)=>{
        const typeColor = typeColors[el]
        const typeClass = classNames('type-badge',`bg-${typeColor}`)
        return <span key={index} className={typeClass}>{el}</span>
    })

    const typeBg = typeColors[pokemonType[0]];
    const itemBox = classNames('poke-item', `bg-${typeBg}`,{
        'hover-in': boxHover === true,
        'hover-out': boxHover === false,
    });

    const handlceClick = () => {
        setIsFaved(true);
        handleAdd(pokeId, pokemonName, pokemonImg, pokemonType);
        setFavListAni(true);
    };
    return (
        <div onMouseEnter={()=>setBoxHover(true)} onMouseLeave={()=>setBoxHover(false)} className={itemBox}>
            <div className='tilt-bg'></div>
            <div className='absolute left-6 top-5 text-sm opacity-60'>No. {pokeId}</div>
            <div className='text-right'>
                <button 
                    className={classNames("fav-btn",{
                        'faved': favData.some((el) => el.pokeId === pokeId)
                    })} 
                    onClick={handlceClick}>
                        <CgPokemon size={36} />
                </button>
            </div>
            <div className='bottom-box'>
                <div className='imgbox'>
                    <img className="w-28 inline-block m-2" src={pokemonImg} alt="pokemon front look" />
                </div>
                <h5 className="text-xl text-neutral-700 font-bold">{pokemonName.find((name) => { return name.language.name === 'zh-Hant' }).name}</h5>
                <div className='text-sm text-neutral-600 opacity-70 mb-2'>{pokemonName.find((name) => { return name.language.name === 'ja' }).name}</div>
                <div className="flex justify-center gap-1">{renderedType}</div>
            </div>
            <div className="absolute top-8 left-5 text-3xl lowercase font-mono font-bold text-white opacity-30">
                {pokemonName.find((name) => { return name.language.name === 'en' }).name}
            </div>
        </div>
    )
}

export default PokeItem;