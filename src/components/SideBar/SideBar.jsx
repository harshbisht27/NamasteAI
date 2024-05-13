import React, { useContext, useState } from 'react'
import './SideBard.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context';

const SideBar = () => {
    const [extended, setExtended] = useState(true);
    const { onSent, prevPrompt, setRecentPrompt, newChat, setPrevprompt } = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        await onSent(prompt);
    }

    const deletePrompt = (index) => {
        const updatedPrevPrompt = [...prevPrompt];
        updatedPrevPrompt.splice(index, 1);
        setPrevprompt(updatedPrevPrompt);
    }

    let lastClickedTime = 0;

    const handleDoubleClick = (index) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickedTime < 300) {
            deletePrompt(index);
        }
        lastClickedTime = currentTime;
    }

    return (
        <div className='sidebar'>
            <div className="top">
                <img className='menu' src={assets.menu_icon} alt="" onClick={() => setExtended(!extended)} />
                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chart</p> : null}
                </div>
                {extended &&
                    <div className="recent">
                        <p className='recent-title'>Recent</p>
                        {prevPrompt.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => loadPrompt(item)}
                                onDoubleClick={() => handleDoubleClick(index)}
                                className="recent-entry"
                            >
                                <img src={assets.message_icon} alt="" />
                                <p>{item.slice(0, 18)}...</p>
                                <img src={assets.trash} onClick={() => deletePrompt(index)} alt="" />
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="" />
                    {extended ? <p>Setting</p> : null}
                </div>
            </div>
        </div>
    )
}

export default SideBar;
