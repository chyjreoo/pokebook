import './favListItem.css';
import { useContext } from "react";
import Context from "../context/provider";
import typeColor from "./typeColor";
import classNames from "classnames";
import { motion, AnimatePresence } from 'framer-motion';
import { TbPokeballOff } from "react-icons/tb";

function FavListItem() {
    const { favData, setFavData } = useContext(Context);
    
    const typeColors = typeColor();
    const handleRemoveFav = (id)=>{
        const updatedData = favData.filter((el)=>{
            return el.pokeId !== id
        })
        setFavData(updatedData)
    }
    const renderedItem = favData.map((item,index)=>{
        const type = item.pokemonType.map((el)=>{
            const typeColor = typeColors[el]
            const typeClass = classNames('type-badge',`bg-${typeColor}`)
            return <span key={el} className={typeClass}>{el}</span>
        })
        
        return (
            <motion.div animate={{ transition: { damping: 800 }, y: 0, opacity:1 }}
                exit={{ opacity: 0, transition: { damping: 800 }, y: "-50%" }}
                initial={{ y: "-50%",opacity:0 }} 
                key={index} 
                className="fav-list-item mb-4"
            >
                <div className="imgbox">
                    <img className="inline-block" src={item.pokemonImg} alt="pokemon mini" />
                </div>
                <div className='textbox'>
                    <div className='font-bold mb-1 text-lg'>{item.pokemonName.find((name) => { return name.language.name === 'zh-Hant' }).name}</div>
                    <div className='flex gap-1'>{type}</div>
                </div>
                <div>
                    <button onClick={()=>handleRemoveFav(item.pokeId)} className='heart-btn'><TbPokeballOff size={32} /></button>
                </div>
            </motion.div>
        )
    })
    return (
        <AnimatePresence>
            {renderedItem}
        </AnimatePresence>
    )
}

export default  FavListItem;