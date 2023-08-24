import { useState,useRef, useEffect } from "react"
import Swal from 'sweetalert2';
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
import { useLoader } from "../../../_app";
import { ThreeDots } from "react-loader-spinner";
import { baseUrl, phpUrl } from "../../../../components/BaseUrl";

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


export default function EditArticle(){
    const [imgpreview,setImgpreview]=useState('');
    const [title,settitle]=useState('');
    const [author,setauthor]=useState('');
    const [content,setcontent]=useState('');
    const [status,setstatus]=useState('');
    const [category,setcategory]=useState('');
    const editorRef=useRef();
    const [authors,setAuthors]=useState([]);
    const [categories,setCategories]=useState([]);
    const {loading,setloading}=useLoader();
    const router=useRouter();
    const {id}=router.query;


     function loadAuthors(){
    axios.get(`${phpUrl}/staff/get-staffs.php?limit=1000000`)
        .then(res=>{
            let data=res.data.data;
            let status=res.data.status;
            if(status==='success'){
                setAuthors(data)
            }else{
                Swal.fire(
                    'Error Occured',
                    status,
                    'warning'
                )
            }
        }).catch(err=>{
            Swal.fire(
                'Error Occured',
                err.message,
                'error'
            )           
        });
    }

    function loadArticle(){
    if(id!==undefined){
    axios.get(`${phpUrl}/article/get-article.php?id=${id}`)
    .then(res=>{
        let data=res.data.data;
        let status=res.data.status;

        if(status==='success'){
            settitle(data.title)
            setauthor(data.authorId)
            setcategory(data.categorySlug+'-'+data.categoryId)
            setcontent(data.content)
            setImgpreview(data.image)
            setstatus(data.status)
        }else{
            Swal.fire(
                'Error Occured',
                status,
                'warning'
            )
        }
    }).catch(err=>{
        Swal.fire(
            'Error Occured',
            err.message,
            'error'
        )           
    });
 }else{
    return;
 }
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
                    'Error Occured',
                    status,
                    'warning'
                )
            }
        }).catch(err=>{
            Swal.fire(
                'Error Occured',
                err.message,
                'error'
            )           
        });
    }

    function handleSubmit(e){
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: "Confirm Action On Article",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Edit it!'
          }).then((result) => {
            if (result.isConfirmed) {
                setloading(true)
        const formData=new FormData(e.target);
        formData.append('content',editorRef.current.getContent());
        formData.append('id',id);

        axios.post(`${phpUrl}/article/update-article.php`,formData,{withCredentials:true})
        .then(res=>{
            let status=res.data.status;
            setloading(false)
            if(status==='success'){
                Swal.fire(
                    'Successful!',
                    'Article Edited',
                    'success'
                )
            }else if(status==='Invalid User'||status==='no Cookie'){
               
                router.push(`/login?next=${router.asPath}`)
            }else{
                Swal.fire(
                    'Error Occured',
                    status,
                    'warning'
                )  
            }
        }).catch(err=>{
            setloading(false)
            Swal.fire(
                'Error Occured',
                err.message,
                'error'
            )
        })
    }
    })
    }
    
    function imgPreview(e){
        setImgpreview(URL.createObjectURL(e.target.files[0]));
    }

    useEffect(()=>{
        loadAuthors();
        loadCategories();
    },[])

    useEffect(()=>{
        loadArticle();
    },[id]);


    return(
        <>
        <div className='mainHeading'>
            <p>Edit Article</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Title</p>
            <input type='text' name='title' value={title} onChange={(e)=>settitle(e.target.value)}/>
            </div>
        </div>
        
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Category</p>
            <select name='category' value={category} onChange={(e)=>setcategory(e.target.value)}>
            {categories.map(category=>{
                return <option value={category.slug+'-'+category.id} key={category.id}>{category.name}</option>
            })}
            </select>
            </div>
        </div>


        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Author</p>
            <select name='author' value={author} onChange={(e)=>setauthor(e.target.value)}>
            {authors.map(author=>{
                return <option value={author.id} key={author.id}>{author.full_name} ({author.position})</option>
            })}
            </select>
            </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Description</p>
            <TextEditor editorRef={editorRef} initialValue={content}/>
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
            <select name='status' value={status} onChange={(e)=>setstatus(e.target.value)}>
            <option value='active'>Activate</option>
            <option value='inactive'>Deactivate</option>
            </select>
            </div>
        </div>

        <div className='admineditbtn'>
        <button >EDIT</button>
        </div>
        </div>
        </form>  
        </>
    )
}