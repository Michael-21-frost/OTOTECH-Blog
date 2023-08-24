import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect,useState,useRef } from "react";
import Swal from "sweetalert2";
import SlidingArticles from "../../../components/SlidingArticles";
import parse from 'html-react-parser';
import { RWebShare } from "react-web-share";
import {baseUrl,phpUrl} from '../../../components/BaseUrl'
import { useLoader } from "../../_app";
import SlidingArticlesLoader from "../../../components/SlidingArticlesLoader";
import Comments from "../../../components/Comments";
import CommentsLoader from "../../../components/CommentsLoader";



export const getServerSideProps=async (context)=>{
    let error=context.query;
    try{
      const res=await axios.get(`${phpUrl}/post/get-post.php?category=${context.params.blogCategory}&article=${context.params.article}`);
      const content= res.data.data[0];
      const pageId=content.id;
      const categoryId=context.params.blogCategory;
      const img_link=content.image;
      const img_link2=content.author&&content.author.image||'';
      const whatsapp=content.author&&JSON.parse(content.author.whatsapp);
      const dribble=content.author&&JSON.parse(content.author.dribble);
      const github=content.author&&JSON.parse(content.author.github);
      const linkedin=content.author&&JSON.parse(content.author.linkedin);
      const twitter=content.author&&JSON.parse(content.author.twitter);
      const instagram=content.author&&JSON.parse(content.author.instagram);
      
      return {
        props:{content,pageId,categoryId,img_link,img_link2,whatsapp,dribble,github,linkedin,twitter,instagram}
      }    
      
    }catch(err){
      return {
        props:{error:err.message}
      } 
    }
    
  }




export default function Article({error,content,pageId,categoryId,img_link,img_link2,whatsapp,dribble,github,linkedin,twitter,instagram}){
    if(error){
        Swal.fire(
          'Error Occured',
          error,
          'error'
        )
  }
  const { loading, setloading } = useLoader();

    const months=['January','February','March','April','May','June','July',
    'August','September','October','November','December'];
    const [articlesSlide,setarticlesSlide]=useState(null);
    const [liked, setLiked]=useState(false);
    const [windowLink, setwindowLink]=useState('');
    const [email, setemail]=useState('');
    const [full_name, setfull_name]=useState('');
    const [comments, setcomments]=useState(null); 
    const limitview=useRef(1);



    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

    function checkLike(){
        let checkTracker=localStorage.getItem('likeTracker');

        if(checkTracker){

        let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));
        if(likeTracker.includes(window.location.href)){
            setLiked(true)
        }else{
        setLiked(false)                         
        } 

        }else{
            return;
        }
          
    }

    function handleLikeBtn(){
        if(liked===false){
            // axios.post('/api/likes/addLike',{page_link:window.location.href,pageId:pageId})
            const formData=new FormData();
            formData.append('pageId',pageId);
            formData.append('page_link',window.location.href);
            axios.post(`${phpUrl}/post/add-like.php`,formData)
            .then(res=>{
                let status=res.data.status;

                if(status==='success'){
                if (typeof window !== 'undefined') {
                    let item = localStorage.getItem('likeTracker');

                if(item){
                    let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));

                    if(likeTracker.includes(window.location.href)){
                        return;
                    }else{
                    likeTracker.push(`${window.location.href}`);
                    localStorage.setItem('likeTracker',JSON.stringify(likeTracker));                          
                    }
                    Toast.fire({
                    icon: 'success',
                    title: ''
                    });

                }else{
                    localStorage.setItem('likeTracker',JSON.stringify([]));
                    let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));
                    likeTracker.push(`${window.location.href}`);
                    localStorage.setItem('likeTracker',JSON.stringify(likeTracker));

                    Toast.fire({
                    icon: 'success',
                    title:''
                });                
                    }



                    
                }




                }else{
                    Toast.fire({
                        icon: 'warning',
                        title: status
                    })
                }
            }).catch(err=>{
                Toast.fire({
                    icon: 'error',
                    title: err.message
                })
            })
        }else{
            let likeTracker =JSON.parse(localStorage.getItem('likeTracker'));
            let indexTracker=likeTracker.indexOf(window.location.href);
            likeTracker.splice(indexTracker,indexTracker+1);
            localStorage.setItem('likeTracker',JSON.stringify(likeTracker));  
        }
    }


     function setView(){
        if(pageId===''){
            return;
        }else{
            const formData=new FormData();
            formData.append('pageId',pageId);
            formData.append('page_link',window.location.href);
        
            axios.post(`${phpUrl}/post/add-view.php`,formData)
            .then(res=>{
                return;
            }).catch(err=>{
                return;
            })
        }
     }


    function setComment(e){
        e.preventDefault();
        setloading(true);
        const formData=new FormData(e.target);
        formData.append('pageId',pageId);

        axios.post(`${phpUrl}/comment/add-comment.php`,formData,{withCredentials:true})
        .then(res=>{
            let status=res.data.status;
            setloading(false);

            if(status==='success'){
                Toast.fire({icon: 'success',title: ''})
                sessionStorage.setItem('userId','lantern')
            } 
            loadComments();
           
        }).catch(err=>{
            setloading(false);
        })
     }



     function loadComments(){
       if(pageId===''){
       return;
       }else{
        axios.get(`${phpUrl}/comment/get-page-comments.php?pageId=${pageId}`,{withCredentials:true})
        // axios.get(`/api/comments/getPageComments?pageId=${pageId}`)
        .then(res=>{
            let data=res.data.data;
            let status=res.data.status;

            if(status==='success'){
                setcomments(data);
            }else{
                return;
            }
        }).catch(err=>{
            alert(err.message)
           return;
        })
       }
    }





    function userAuth(){
        axios.get(`${phpUrl}/authentication/user-auth.php`,{withCredentials:true})
         .then(res=>{
             let data=res.data.data;
             let status=res.data.status;
             if(status==='success'){
                setfull_name(data.full_name);
                setemail(data.email);
            }else{
               return;
            }

         }).catch(err=>{
             return;
         })
     }


     function loadArticlesByCategory(){
        if(pageId===''){
            return;
        }else{
        // axios.get(`${phpUrl}/new/get-categoryArticles.php?category=${categoryId}`)
        axios.get(`${phpUrl}/main/get-categoryArticles.php?category=${categoryId}&limit=10`)
        .then(res=>{
            let status=res.data.status;
            let data=res.data.data;
            if(status==='success'){
                setarticlesSlide(data)
            }else{
                Swal.fire(
                    'Error Occured',
                    res.data,
                    'warning'
                )
            }
        }).catch(err=>{
            // Swal.fire(
            //     'Error Occured',
            //     err.message,
            //     'error'
            // )           
        });            
        }

      }

    useEffect(()=>{
    setwindowLink(window.location.href)
    checkLike()
    userAuth();
    loadComments()
    loadArticlesByCategory(); 
    if(limitview.current===1){
        setView();
        limitview.current=0;
    }else return
   },[])

    useEffect(()=>{

    },[pageId])



    return(
    <>
    <Head>
        <title>{content && content.title}</title>
        <meta name="description" content="Web Technology, app development, content writing, web management, SEO" />
        <link rel="icon" href="/favicon.ico" />
    </Head>






     
     <div className='articleHeadCon'>
        <div className='articleHead'><h1>{content && content.title}</h1>
        <p> {content && `Posed on ${months[content.month]} ${content.day}, ${content.year}`}</p>
        </div>
        <div className="articleImg">
        <div style={{width:'100%',height:'100%',position:'relative'}}>
           {img_link && 
            <Image 
            src={img_link}
            alt='Cover Image'
            layout="fill"
            quality={90}
            // objectFit="fill"
            blurDataURL="/favicon.io"
            placeholder="blur"
            priority
            />}
        </div>
        </div>

     </div>
     






     <div className="articleCreditCon">


        <div className='articleAuthorCon'>
            <div className='authorImg'>
               {img_link2 && <Image
                src={img_link2}
                width={40}
                height={40}
                style={{borderRadius:'50%'}}
                placeholder='blur'
                blurDataURL="/imageLoader.png"
                priority
                />}
            </div>

            <div className="articleAuthor">
                <p>AUTHOR</p>
                <p>{content && content.author&& content.author.full_name}</p>
                <p>{content && content.author&& content.author.description}</p>
            <div className="authorSocialLinks">
            {whatsapp&&whatsapp.status==='inactive'|| ''? '' :<Link href={`${whatsapp&&whatsapp.link}`}><a><i className='fa fa-whatsapp'/></a></Link>}
            {dribble&&dribble.status==='inactive'|| ''? '' :<Link href={`${dribble&&dribble.link}`}><a><i className='fa fa-dribble'/></a></Link>}
            {github&&github.status==='inactive'|| ''? '' :<Link href={`${github&&github.link}`}><a><i className='fa fa-github'/></a></Link>}
            {linkedin&&linkedin.status==='inactive'|| ''? '' :<Link href={`${linkedin&&linkedin.link}`}><a><i className='fa fa-linkedin'/></a></Link>}
            {twitter&&twitter.status==='inactive'|| ''? '' :<Link href={`${twitter&&twitter.link}`}><a><i className='fa fa-twitter'/></a></Link>}
            {instagram&&instagram.status==='inactive'|| ''? '' :<Link href={`${instagram&&instagram.link}`}><a><i className='fa fa-instagram'/></a></Link>}
            </div>
               </div>
        </div>


        <div className="articleShareCon">
            <div className="articleShare">
            <RWebShare
            data={{
            text: "Like humans, flamingos make friends for life",
            url: `${windowLink}`,
            title: `${content && content.title}`,
            }}>

            <button onClick={()=>navigator.share({title:`${content && content.title}`,text:'OTOTCH BLOG',url:`${windowLink}}`})}>Share <i className="fa fa-share"/></button>
            </RWebShare>
                <Link href={`https://www.linkedin.com/shareArticle?mini=true&url=${windowLink}i&title=${content && content.title}&source=OTOTECH Blog`}><a><i className="fa fa-linkedin"/></a></Link>
                <Link href={`https://twitter.com/intent/tweet?text=${windowLink}`}><a><i className="fa fa-twitter"/></a></Link>
                <Link href={`https://www.facebook.com/sharer/sharer.php?u=${windowLink}`}><a><i className="fa fa-facebook"/></a></Link>
            </div>
        </div>


     </div>






     <div className="articleContentCon">
        <div >{content && parse(content.content)}</div>
     </div>









     <div className="likeArticleCon">
    <button onClick={()=>{setLiked(!liked),handleLikeBtn()}} style={{background:`${liked==true ? '#9c9a9a' : '#ec9735'}`,
     boxShadow:`${liked==true ? 'none' : '-1px 2px 4px rgba(0, 0, 0, 0.2)'}`}}>
        <i className='fa fa-thumbs-up'></i>
        </button>
     </div>






     <div className='commentBoxCon'>

        <form onSubmit={setComment}>
            <h3>Leave a Comment</h3>
        <input required='required' type='text' name='full_name' placeholder="Full Name" value={full_name} onChange={(e)=>setfull_name(e.target.value)}/>
        <input required='required' type='email' name='email' placeholder="E-mail Address" value={email} onChange={(e)=>setemail(e.target.value)}/>
        <textarea required='required' placeholder="Your Comment" name='comment'/>
        <button>Submit</button>
        </form>

     </div>




{comments!==null ? <Comments comments={comments}/> : <CommentsLoader/>}



     {articlesSlide!==null ? <SlidingArticles articlesSlide={articlesSlide} title='Related Topics'/>: <SlidingArticlesLoader/>}

    </>
    )
}