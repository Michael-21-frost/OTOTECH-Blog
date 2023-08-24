import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { baseUrl,phpUrl } from '../components/BaseUrl';
import { useLoader } from './_app';



export default function Php() {
  const [articlesSlide,setarticlesSlide]=useState(null);
  const { loading, setloading } = useLoader();
  const [articles,setarticles]=useState(null)
  const [blogData,setblogData]=useState(null)
  let limit=useRef(8)




function loadArticles(){
  setloading(true)
  axios.get(`/api/articles/getArticles?limit=${limit.current}`,{withCredentials:true})
  .then(res=>{
      let status=res.data.status;
      let data=res.data.data;
      setloading(false);

      if(status==='success'){
          setarticles(data)
      }else{
          Swal.fire(
              'Error Occured',
              res.data.status,
              'warning'
          )
      }
  }).catch(err=>{
    setloading(false);
      Swal.fire(
          'Error Occured',
          err.message,
          'error'
      )           
  });
}




function loadArticlesByViews(){
  axios.get(`${phpUrl}/ototechApi/sent.php`)
  .then(res=>{
    //   let status=res.data.status;
    //   let data=res.data.data;
    //   if(status==='success'){
    //       setarticlesSlide(data)
    //   }else{
        //   Swal.fire(
        //       'Success',
        //       res.data,
        //       'success'
        //   )
          setarticlesSlide(res.data)
          setarticles(res.data.arrays)
          console.log('result',res)
    //   }
  }).catch(err=>{
      Swal.fire(
          'Error',
          err.message,
          'error'
      )      
  });
}



// useEffect(()=>{
// //   setarticles(blogData);
//   loadArticlesByViews();
// },[])

  return (
    <>
      <Head>
        <title>OTOTECH BLOG</title>
        <meta name="description" content="Web Technology, app development, content writing, web management, SEO" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ec9735" />
      </Head>

<h1>PHP API INITIATION in {articlesSlide&&articlesSlide.city}</h1>
<div className='adminmorebtn'><button onClick={loadArticlesByViews}>Check PHP API</button></div>
{articles&&articles.map((article,i)=>{
return <p key={i}><i>{article}</i></p>
})}
    </>
  )
}
