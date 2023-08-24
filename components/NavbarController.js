import $ from 'jquery';

export default function NavbarController({navStatus,setnavStatus}){

    function navbaring(){
        if(navStatus===false){
            $('.navbar').css('margin-left','0');
        }else{
            $('.navbar').css('margin-left','-80%');
        }
    }



    return(
        <>
        <div className='navbarController' onClick={()=>(setnavStatus(!navStatus),navbaring())}>
          {navStatus===false ? <i className="fa fa-bars"/> : <i className="fa fa-times"/>}  
        </div>
        </>
    )
}