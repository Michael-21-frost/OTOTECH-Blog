import Link from 'next/link'

export default function CategoryList({categories}) {
    const listing=categories && categories.map((categ,i)=>{
        const {name,slug,icon,description}=categ;
        return(
        <Link href={`${slug}`} key={i}>
        <a className='categoryCon' >
        <div className='categoryIcon'><i className={`fa fa-${icon}`}/></div>
        <div className='categoryInfo'>
            <h2>{name}</h2>
            <p>{(description).slice(0,120)+'...'}</p>
        </div>
        </a>
        </Link>
        )
    })

    return(
        <>
        <div className='categoriesCon2'>
        <div className='categories'>
            {listing}
        </div>
      </div>
        </>
    )
}
