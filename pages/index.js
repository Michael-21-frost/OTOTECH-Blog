import Head from 'next/head'
import Link from 'next/link'
import $ from 'jquery';
import { useEffect, useRef, useState } from 'react'
import SlidingArticles from '../components/SlidingArticles';
import BlogList from '../components/BlogList';
import Mainscreen from '../components/Mainscreen';
import axios from 'axios';
import CategoryList from '../components/CategoryList';
import Swal from 'sweetalert2';
import { baseUrl,phpUrl } from '../components/BaseUrl';
import { useLoader } from './_app';
import Image from 'next/image';
import BlogLoader from '../components/BlogLoader';
import SlidingArticlesLoader from '../components/SlidingArticlesLoader';

export const getServerSideProps=async (context)=>{
let error;
try{
  // const res=await axios.get(`${baseUrl}/api/categories/getCategories`);
  // const res3=await axios.get(`${baseUrl}/api/articles/getArticles?limit=8`);
  const res=await axios.get(`${phpUrl}/main/get-categories.php?limit=400`);
  const res3=await axios.get(`${phpUrl}/main/get-articles.php?limit=8`);
  const categories= res.data.data||null;
  const blogData= res3.data.data||null;
  
  return {
    props:{categories,blogData}
  }    
  
}catch(err){
  return {
    props:{error:err.message}
  } 
}

}

export default function Home({categories,blogData,error}) {
  const [articlesSlide,setarticlesSlide]=useState(null);
  const { loading, setloading } = useLoader();
  const [articles,setarticles]=useState(null)
  let limit=useRef(8)
  
  if(error){
    Swal.fire(
      error,
      'Please check your connection',
      'error'
    )
  }

  

  function dropdown1(){
  $('.filterSearch1').on('focus',function(){
    $('.main4').css('display','block')
  });
  $('.filterSearch1').on('focusout',function(){
    $(document).on('click',function(e){
      if(e.target.className=='main4'||e.target.className=='filterSearch1'){
        return
      }else{
        $('.main4').css('display','none')
      }
    })
  });
  }



function loadArticles(){
  setloading(true)
  axios.get(`${phpUrl}/main/get-articles.php?limit=${limit.current}`)
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
  axios.get(`${phpUrl}/main/get-articlesByViews.php?limit=${10}`)
  .then(res=>{
      let status=res.data.status;
      let data=res.data.data;
      if(status==='success'){
          setarticlesSlide(data)
      }else{
          Swal.fire(
              'Error Occured',
              res.data.status,
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


  function loadMore(){
    limit.current=limit.current+8;
    loadArticles()
  }

  useEffect(()=>{
    dropdown1();  
  })

useEffect(()=>{
  setarticles(blogData);
  loadArticlesByViews();
},[])

  return (
    <>
      <Head>
        <title>OTOTECH BLOG</title>
        <meta name="description" content="Web Technology, app development, content writing, web management, SEO" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#ec9735" />
      </Head>


    <Mainscreen heading='OTOTECH BLOG' description='The Ototech Blog is the top hub for developers, designers,
     finance experts, executives, and entrepreneurs,
     featuring key technology updates, tutorials, freelancer resources, and management insights.'
     imgLink='/OTOTECH2.jpg' page='home'/>






<CategoryList categories={categories}/>







      <div className='emailRegisterCon'>
        <div className='emailRegister'>
          <h2>World-class articles, delivered weekly.</h2>
          <form>
            <input type='email' placeholder='Enter your email'/>  
            <button disabled>Submit</button>
          </form>
        </div>
      </div>















      <div className='categoriesCon3'>
      



      {articles!==null ? <BlogList articles={articles}/> : <BlogLoader/>}

      


      <div className='blogNavCon'>
        <div className='blogNav'>
        <button onClick={loadMore}>Load More</button>
        </div>
      </div>
      </div>









      <div className='blogAdsCon'>
    <div className='blogAdsInfo'>
      <h2>IN NEED OF A WEBSITE, MOBILE APP, COPY WRITING SERVICES e.t.c ?<br/>
      VISIT US HERE TO GET A WORLD CLASS SERVICE</h2>
      <Link href='#'>OUR SERVICES</Link>
    </div>
    <div className='blogAdsImg'>
     <Image
     src='/OTOTECH3.png'
     layout="fill"
     blurDataURL="/favicon.io"
     placeholder="blur"
     />
    </div>
  </div>


  {articlesSlide!==null ? <SlidingArticles articlesSlide={articlesSlide} title='Most Read Articles'/>
 : <SlidingArticlesLoader/>}








    </>
  )
}
