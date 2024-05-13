import { createContext, useState ,useEffect} from "react";
import runChat from "../config/gemini";


export const Context = createContext();

const ContextProvider = (props) =>{


    const [input , setInput] = useState("");
    const [recentPrompt, setRecentPrompt ]= useState('');
    const [prevPrompt,setPrevprompt] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData]= useState('');
    const [voiceSearch, setVoiceSearch] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [recordingAnimation, setRecordingAnimation] = useState(false);


    const deplayPara = (index, nextWord)   =>{
        setTimeout(function(){
            setResultData(prev=>prev +nextWord)
        },75*index)
    }
    useEffect(() => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setVoiceSearch(false);
            setInput(transcript);
            input(transcript)
            onSent(transcript); // Call onSent function with the voice input
            
            setInput("")
            setRecordingAnimation(false); 
        };

        recognition.onend = () => {
            setVoiceSearch(false);
            setRecordingAnimation(false);
        };

        setRecognition(recognition);
    }, []);

    const openVoiceSearch = () => {
        if (!voiceSearch) {
            recognition.start();
            setVoiceSearch(true);
            setRecordingAnimation(true);
        }
    };
    const newChat =()=>{
        setLoading(false)
        setShowResult(false)
    }
    const onSent = async (prompt) => {
        if (loading) return; // Prevent multiple calls if already loading
    
        setLoading(true);
        setShowResult(true);
        setResultData("");
    
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        } else {
            setPrevprompt(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }
    
        let newResponse = "";
        let responseArray = response.split("**");
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let formattedResponse = newResponse.split("*").join("</br>");
    
        setResultData(formattedResponse);
        setInput("");
        setLoading(false);
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
          onSent();
        }
      };

    const contextValue={
        prevPrompt,
        setPrevprompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,newChat,
        handleKeyPress,
        voiceSearch,
        openVoiceSearch,
        recordingAnimation,
        setRecordingAnimation
        
    }

    return (
        <Context.Provider value ={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider