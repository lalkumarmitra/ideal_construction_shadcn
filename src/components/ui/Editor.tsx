import React, { useEffect, useState } from "react"
import { MinimalTiptapEditor } from "../minimal-tiptap"

interface EditorProps {
    onChange? : (value:any) => void
}

const Editor: React.FC<EditorProps> = ({onChange=()=>null}) => {
    const [value, setValue] = useState<any>('')
    useEffect(()=>{
        onChange(value);
    },[value])
    
    return (
        <MinimalTiptapEditor 
            value={value}
            onChange={(e)=>setValue(e)}
            throttleDelay={2000}
            className="w-full"
            editorContentClassName="p-5"
            output="html"
            placeholder="Type your description here..."
            autofocus={true}
            immediatelyRender={true}
            editable={true}
            injectCSS={true}
            editorClassName="focus:outline-none"
        />
    )
}

export default Editor
