import Image from "next/image";

export default function CommentsLoader({}){
  let listing;
  let comments=[1,2,3]

  listing=comments.map((comment,i)=>{

    return(
    <div className='articleAuthorCon' style={{width:'100%'}} key={i}>
    <div className='authorImg'>
    <Image
    src='/imageLoader.png'
    width={40}
    height={40}
    style={{borderRadius:'50%'}}
    placeholder='blur'
    blurDataURL="/favicon.io"
    />
    </div>

    <div className="articleAuthor" >
    <p style={{width:'50%',height:'18px',background:'rgba(201, 197, 197,0.4)',marginBottom:'8px'}}></p>
    <p style={{width:'100%',height:'50px',background:'rgba(201, 197, 197,0.4)'}}></p>
    </div>
    </div>
    )
})


    return(
        <>
        <div className="articleCommentsCon">
<h3>{comments.length!==0 ? 'Comments' :'Comments (no comments yet)'}</h3>
{listing}
</div>
        </>
    )

}