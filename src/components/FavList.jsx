import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './favList.css'
import FavListItem from "./FavListItem";
import { GoChevronLeft } from "react-icons/go";
import { CgPokemon } from "react-icons/cg";
import Context from '../context/provider';
import classNames from 'classnames';

function FavList() {
    const { favData, favListAni } = useContext(Context);
    const [favListShow, setFavListShow] = useState(false);
    
    const favListTriggerClass = classNames('fav-list-trigger',{
        'active': favListAni === true
    })

    const variants = {
         open: (height = 1000) => ({
            clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
            transition: {
                type: "spring",
                stiffness: 20,
                restDelta: 2,
                staggerChildren: 0.07, delayChildren: 0.2
            }
        }),
        closed: {
            clipPath: "circle(0px at 0px 0px)",
            transition: {
                delay: 0.1,
                type: "spring",
                stiffness: 400,
                damping: 40,
                staggerChildren: 0.05, staggerDirection: -1
            }
        }
    }
    return (
        <div className='fav-list-wrapper'>
            <div onClick={()=>setFavListShow(!favListShow)} className={favListTriggerClass}>
                <div className="pokeball-box">
                    <div className="pokeball">
                        <div className="pokeball__button"></div>
                    </div>   
                </div>
            </div>
            <AnimatePresence >
                
                <motion.div className="fav-list h-dvh" animate={favListShow ? "open" : "closed"} variants={variants}>
                    <button onClick={()=>setFavListShow(!favListShow)} className='text-white text-left flex items-center mb-8' type='button'>
                        <GoChevronLeft size={50} />
                        <div className='flex items-center'>
                            <CgPokemon size={50} />
                            <div className='textbox ml-3'>
                                <p className='text-2xl leading-none'>返回</p>
                                <span className='text-sm leading-none'>back</span>
                            </div>
                        </div>
                    </button>
                    {favData.length ? <FavListItem /> : <div className='text-white opacity-70 h-5/6 flex items-center justify-center'>還沒抓到任何寶可夢</div>}
                    
                </motion.div>
            </AnimatePresence>
            {/* {
                favListShow ? 
                <motion.div className="fav-list h-dvh" animate={favListShow ? "open" : "closed"} variants={variants}>
                    <button onClick={()=>setFavListShow(!favListShow)} className='text-white text-left flex items-center mb-8' type='button'>
                        <GoChevronLeft size={50} />
                        <div className='flex items-center'>
                            <CgPokemon size={50} />
                            <div className='textbox ml-3'>
                                <p className='text-2xl leading-none'>返回</p>
                                <span className='text-sm leading-none'>back</span>
                            </div>
                        </div>
                    </button>
                    {favData.length ? <FavListItem /> : <div className='text-white opacity-70 h-5/6 flex items-center justify-center'>尚未加入喜愛的寶可夢</div>}
                    
                </motion.div> :
                null
            } */}
            
        </div>
    )
}

export default FavList;