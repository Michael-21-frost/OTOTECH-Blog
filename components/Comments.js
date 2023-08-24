import Image from "next/image";

export default function Comments({comments}){
  let listing;

  listing=comments.map((comment,i)=>{

    return(
    <div className='articleAuthorCon' style={{width:'100%'}} key={i}>
    <div className='authorImg'>
    <Image
    src='/user.png'
    width={40}
    height={40}
    style={{borderRadius:'50%'}}
    placeholder='blur'
    blurDataURL="/favicon.io"
    />
    </div>

    <div className="articleAuthor" >
    <p>{comment.user&&comment.user.full_name} ({`${comment.day}/${parseInt(comment.month)+1}/${comment.year}`})</p>
    <p>{comment.comment}</p>
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