import { useState,useRef } from "react"
import "tinymce/tinymce";
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
// import 'tinymce/skins/content/default/content.min.css';
import 'tinymce/models/dom/model';
import {Editor} from '@tinymce/tinymce-react';


export default function TextEditor({editorRef,show,initialValue}){

    return(
        <>
            <Editor
            onInit={(evt,editor)=> editorRef.current=editor}
            init={{
                menubar:false,
                skin:false,
                content_css:false
            }}
            initialValue={initialValue}
            onChange={show}
            />
        </>
    )
}