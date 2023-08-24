import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import parse from 'html-react-parser';

export default function BlogList({articles}){
  const months=['January','February','March','April','May','June','July',
  'August','September','October','November','December'];
  let listing;

     listing=articles&&articles.map((article,i)=>{
      const {title,image,author,slug,categorySlug,content,views,likes,day,month,year}=article;

      return(
        <Link href={categorySlug+'/'+slug} key={i}><a className='blogCon' key={i}>
        <div className='blogImg'>
          <Image 
          src={image}
          layout="fill"
          blurDataURL="/favicon.io"
          placeholder="blur"
          priority
          />
        </div>
        <div className='blogInfo'>
  
        <div className="blogMetaData">
        <div>by <span>{author&&author.full_name}</span> / <span>{day}th {months[month]}, {year}</span></div>
        <div></div>
        </div>
  
        <div>
        <h3>{title}</h3>
          <p>{parse(content)}</p> 
        </div>
        </div>
  
        <div className='blogDataCon'>
          <div className='blogData'>
          <i className='fa fa-eye'><p>{views}</p></i>
          <i className='fa fa-thumbs-up'><p>{likes}</p></i>
          </div>
          <div className='blogRead'><Link href='#'><p>Read</p></Link></div>
        </div>
        </a>
      </Link>

      )
    })

 

    return(
        <>
        <div className='categories'>
          {articles&&listing}



        
        </div>
        </>
    )
}