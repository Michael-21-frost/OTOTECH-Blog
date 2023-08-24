import $ from 'jquery';
import { useState } from 'react';

export default function CategorydropDown(){
    const [slideStatus,setslideStatus]=useState(false);

    function sliding(){
        setslideStatus(!slideStatus);
        if (slideStatus===false) {
            $('.filterCon2').css('display','flex');
            $('.filterCon2').css('margin-top','0');
            $('.categoriesCon').css('background','#e6e9ec');
            $('.categoriesCon').css('border','1px solid #b9b8b8');
            $('.categoriesHeading').css('color','gray');
            $('#slideIcon').css('color','gray');
        } else {
            $('.filterCon2').css('display','none');
            $('.filterCon2').css('margin-top','-100%');
            $('.categoriesCon').css('background','#ec9735');
            $('.categoriesCon').css('border','none');
            $('.categoriesHeading').css('color','white');
            $('#slideIcon').css('color','white');
        }
    }

    return(
        <>
        <div className="categoriesCon">
        <p className='categoriesHeading'>Categories</p>
        {
        slideStatus===false ? <i className="fa fa-arrow-down" onClick={sliding} id='slideIcon'/> 
        :
        <i className="fa fa-arrow-up" onClick={sliding} id='slideIcon'/>
        }
        </div>
        </>
    )
}