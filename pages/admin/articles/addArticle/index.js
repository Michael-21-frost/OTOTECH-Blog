import { useState,useRef, useEffect } from "react"
import Swal from 'sweetalert2';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import axios from "axios";
import { useLoader } from "../../../_app";
import { ThreeDots } from "react-loader-spinner";
import {baseUrl,phpUrl} from '../../../../components/BaseUrl';
const TextEditor = dynamic(() =>
import("../../../../components/TextEditor"), {   ssr: false ,loading: () => 
<div style={{width:'100%',height:'400px',background:'#f5f6f6',display:'flex',justifyContent:'center',alignItems:'center'}}>
<ThreeDots
height="40" 
width="40" 
radius="9"
color="#945f0f" 
ariaLabel="three-dots-loading"
wrapperStyle={{}}
wrapperClassName=""
visible={true}
/></div>
});



export default function AddArticle(){
    const [imgpreview,setImgpreview]=useState('');
    const [authors,setAuthors]=useState([]);
    const [categories,setCategories]=useState([]);
    const editorRef=useRef();
    const {loading,setloading}=useLoader();
    const router=useRouter();
    const next=router.asPath;

    function loadAuthors(){
    axios.get(`${phpUrl}/staff/get-staffs.php?limit=1000000`)
        .then(res=>{
            let data=res.data.data;
            if(res.data.status==='success'){
                setAuthors(data)
            }else{
                Swal.fire(
                    'Error',
                    res.data.status,
                    'warning'
                )
            }
        }).catch(err=>{
            Swal.fire(
                'Error',
                'Error Occured at Axios',
                'warning'
            )           
        });
    }

    function loadCategories(){
    axios.get(`${phpUrl}/category/get-categories.php?limit=1000000`)
        .then(res=>{
            let status=res.data.status;
            let data=res.data.data;
            if(status==='success'){
                setCategories(data)
            }else{
                Swal.fire(
                    'Error',
                    res.data.status,
                    'warning'
                )
            }
        }).catch(err=>{
            Swal.fire(
                'Error',
                'Error Occured at Axios',
                'warning'
            )           
        });
    }


    function handleSubmit(e){
        e.preventDefault();
        const formData=new FormData(e.target);
        formData.append('content',editorRef.current.getContent());
        setloading(true);
    axios.post(`${phpUrl}/article/add-article.php`,formData)
        .then(res=>{
            let status=res.data.status;
            setloading(false);
            if(status==='success'){
                Swal.fire(
                    'Successful!',
                    'Article Added',
                    'success'
                )
            }else if(status==='Invalid User'||status==='no Cookie'){
                router.push(`/login?next=${next}`)
            }else{
                Swal.fire(
                    'Error!',
                    status,
                    'warning'
                )  
            }
        }).catch(err=>{
            setloading(false)
            Swal.fire(
                'Error!',
                err.message,
                'error'
            )
        })
    }

    
    function imgPreview(e){
        setImgpreview(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(()=>{
        loadAuthors()
        loadCategories()
    },[])



    return(
        <>
        <div className='mainHeading'>
            <p>Add Article</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Title</p>
            <input type='text' name='title'/>
            </div>
        </div>
        
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Category</p>
            <select name='category'>
            {categories.map(category=>{
                return <option value={category.slug+'-'+category.id} key={category.id}>{category.name}</option>
            })}
            </select>
            </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Author</p>
            <select name='author'>
            {authors.map(author=>{
                return <option value={author.id} key={author.id}>{author.full_name} ({author.position})</option>
            })}
            </select>
            </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Content</p>
            <TextEditor editorRef={editorRef}/>
            </div>
        </div>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Thumbnail(Image)</p>

            <div className='previewimg'>
            <img src={imgpreview}/>
            </div>

            <input type='file' name='img_link' onChange={imgPreview}/>

        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Status</p>
            <select name='status'>
            <option value='active'>Activate</option>
            <option value='inactive'>Deactivate</option>
            </select>
            </div>
        </div>

        <div className='admineditbtn'>
        <button >ADD</button>
        </div>
        </div>
        </form>  
        </>
    )
}