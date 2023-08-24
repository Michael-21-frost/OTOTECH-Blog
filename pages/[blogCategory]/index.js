import Head from "next/head";
import Link from "next/link";
import {useRouter} from 'next/router'
import { useEffect,useRef,useState } from "react";
import BlogList from "../../components/BlogList";
import SlidingArticles from "../../components/SlidingArticles";
import styles from '../../styles/blogCategory.module.css'
import $ from 'jquery';
import Mainscreen from "../../components/Mainscreen";
import axios from "axios";
import Swal from "sweetalert2";
import { baseUrl, phpUrl } from "../../components/BaseUrl";
import { useLoader } from "../_app";


export const getServerSideProps=async (context)=>{
  let error=context.query;
  try{
    const res=await axios.get(`${phpUrl}/main/get-categorybyslug.php?slug=${context.params.blogCategory}`);
    const res2=await axios.get(`${phpUrl}/main/get-categoryArticles.php?category=${context.params.blogCategory}&limit=10`);
    const category= res.data.data||null;
    const blogData= res2.data.data||null;
    
    return {
      props:{category,blogData}
    }    
    
  }catch(err){
    return {
      props:{error:error}
    } 
  }
  
}

  
export default function BlogCategory({category,blogData,error}){
  let router=useRouter();
    const [articlesSlide,setarticlesSlide]=useState(null);
    const [categories,setcategories]=useState([]);
    const [articles,setarticles]=useState([]);
    const { loading, setloading } = useLoader();
    let limit=useRef(10);

    if(error){
      Swal.fire(
        'Error at ServerSideProps',
        error,
        'warning'
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
      

        function loadArticlesByViews(){
          axios.get(`${phpUrl}/main/get-articlesByViews.php?limit=${10}`)
          .then(res=>{
              let status=res.data.status;
              let data=res.data.data;
              if(status==='success'){
                setarticlesSlide(data);
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
      

        function loadArticlesByCategory(){
          setloading(true);
          axios.get(`${phpUrl}/main/get-categoryArticles.php?category=${router.query.blogCategory}&limit=${limit.current}`)
          .then(res=>{
              let status=res.data.status;
              let data=res.data.data;
              setloading(false)
              if(status==='success'){
                  setarticles(data)
              }else{
                  Swal.fire(
                      'Error Soil',
                      res.data.status,
                      'warning'
                  )
              }
          }).catch(err=>{
            setloading(false);
              Swal.fire(
                  'Error Soil2',
                  err.message,
                  'warning'
              )           
          });            
  
        }


        
  function loadCategories(){
    axios.get(`${phpUrl}/main/get-categories.php?limit=400`)
    .then(res=>{
        let status=res.data.status;
        let data=res.data.data;
        if(status==='success'){
            setcategories(data)
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

        function loadMore(){
          limit.current=limit.current+10;
          loadArticlesByCategory();
        }

        useEffect(()=>{
          dropdown1();  
        })

        useEffect(()=>{
          setarticles(blogData);
          loadCategories();
          loadArticlesByViews();
        },[])

    



    return(
        <>
      <Head>
        <title>{category&&category.name}</title>
        <meta name="description" content="Web Technology, app development, content writing, web management, SEO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>







      <Mainscreen heading={category&&category.name} description={category&&category.description}
     imgLink={category && category.img && category.img.url} page='blogCategory'/>





<div className={styles.categorySliderCon}>
<div className={styles.categorySlider}>
  {
    categories && categories.map((category,i)=>{
return <Link href={category.slug&&category.slug} key={i}><a className={styles.categorySlide}><i className={`fa fa-${category.icon}`}/>{category.name}</a></Link>
    })
  }
  </div>
</div>










     <div className='categoriesCon3'>
      
      
      {articles&&articles.length !==0 ? <BlogList articles={articles}/> : ''}


      <div className='blogNavCon'>
        <div className='blogNav'>
        {articles&&<button onClick={loadMore}>Load More</button>}
        </div>
      </div>
      </div>


      {articlesSlide&&articlesSlide.length !==0 ? <SlidingArticles articlesSlide={articlesSlide} title='Most Read Articles'/>: ''}
        </>
    )
}