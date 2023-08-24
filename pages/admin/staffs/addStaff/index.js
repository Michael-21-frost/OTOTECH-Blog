import { useState } from "react"
import Swal from 'sweetalert2';
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { useLoader } from "../../../_app";
import { useRouter } from "next/router";
import { baseUrl,phpUrl } from "../../../../components/BaseUrl";

export default function AddStaff(){
    const [imgpreview,setImgpreview]=useState('');
    const [selectedOption,setselectedOption]=useState([])
    const [whatsapp,setwhatsapp]=useState({status:'active',link:''})
    const [dribble,setdribble]=useState({status:'active',link:''})
    const [github,setgithub]=useState({status:'active',link:''})
    const [linkedin,setlinkedin]=useState({status:'active',link:''})
    const [twitter,settwitter]=useState({status:'active',link:''})
    const [instagram,setinstagram]=useState({status:'active',link:''})
    const {loading,setloading}=useLoader();
    const router=useRouter()
    
    const options = [
        { value: 'addCategories', label: 'Add Categories' },
        { value: 'editCategories', label: 'Edit Categories' },
        { value: 'deleteCategories', label: 'Delete Categories' },
        { value: 'addArticles', label: 'Add Articles' },
        { value: 'editArticles', label: 'Edit Articles' },
        { value: 'deleteArticles', label: 'Delete Articles' },
        { value: 'deleteComments', label: 'Delete Comments' },
        { value: 'editUsers', label: 'Edit Users' },
        { value: 'deleteUsers', label: 'Delete Users'},
        { value: 'addStaffs', label: 'Add Staffs' },
        { value: 'editStaffs', label: 'Edit Staffs' },
        { value: 'deleteStaffs', label: 'Delete Staffs' },
        { value: 'editSupportSystem', label: 'Edit Support System' },
    ];
    
  

  function handleSubmit(e){
    e.preventDefault();
    
    const formData=new FormData(e.target);
    formData.append('whatsapp',JSON.stringify(whatsapp));
    formData.append('dribble',JSON.stringify(dribble));
    formData.append('github',JSON.stringify(github));
    formData.append('linkedin',JSON.stringify(linkedin));
    formData.append('twitter',JSON.stringify(twitter));
    formData.append('instagram',JSON.stringify(instagram));
    formData.append('priveledges',JSON.stringify(selectedOption));
    setloading(true);
    axios.post(`${phpUrl}/staff/add-staff.php`,formData,{withCredentials:true})
    .then(res=>{
        let status=res.data.status;
        setloading(false)
        if(status==='success'){
            Swal.fire(
                'Successful!',
                'Staff Added',
                'success'
            )
        }else if(status==='Invalid User'||status==='no Cookie'){
            router.push(`/login?next=${router.asPath}`)
        }else{
            Swal.fire(
                'Error Occured',
                status,
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
    })
}


    
    function imgPreview(e){
        setImgpreview(URL.createObjectURL(e.target.files[0]));
    }


    return(
        <>
        <div className='mainHeading'>
            <p>Add Staff</p>
        </div>


        <form onSubmit={handleSubmit}>
        <div className='addcategcon'>
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Full Name</p>
            <input type='text' name='full_name'/>
            </div>
        </div>
        
        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Email Address</p>
            <input type='email' name='email'/>
        </div>
        </div>

        <div className='admineditnamecon'>
        <div className='admineditname'>
            <p>Password</p>
            <input type='password' name='password'/>
        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Position</p>
            <input type='text' name='position'/>
        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Description</p>
            <textarea type='text' name='description'/><p>description should not be more than 150 words</p>
        </div>
        </div>


        <div className='adminLinkscon'>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={whatsapp.status} onChange={(e)=>setwhatsapp({status:e.target.value,link:whatsapp.link})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deactivate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Whatsapp Link</p>
            <input type='text' value={whatsapp.link} onChange={(e)=>setwhatsapp({status:whatsapp.status,link:e.target.value})}/>
        </div>
        </div>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={dribble.status} onChange={(e)=>setdribble({status:e.target.value,link:dribble.link})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deactivate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Dribble Link</p>
            <input type='text' value={dribble.link} onChange={(e)=>setdribble({status:dribble.status,link:e.target.value})}/>
        </div>
        </div>
        </div>


        <div className='adminLinkscon'>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={github.status} onChange={(e)=>setgithub({status:e.target.value,link:github.link})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deactivate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Github Link</p>
            <input type='text' value={github.link} onChange={(e)=>setgithub({status:github.status,link:e.target.value})}/>
        </div>
        </div>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select  value={linkedin.status} onChange={(e)=>setlinkedin({status:e.target.value,link:linkedin.link})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deactivate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>LinkedIn Link</p>
            <input type='text' value={linkedin.link} onChange={(e)=>setlinkedin({status:linkedin.status,link:e.target.value})}/>
        </div>
        </div>
        </div>


        
        <div className='adminLinkscon'>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={twitter.status} onChange={(e)=>settwitter({status:e.target.value,link:twitter.link})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deactivate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Twitter Link</p>
            <input type='text' value={twitter.link} onChange={(e)=>settwitter({status:twitter.status,link:e.target.value})}/>
        </div>
        </div>

        <div className='adminLinks'>
        <div className='adminLinksPrefix'>
            <p>Status</p>
            <select value={instagram.status} onChange={(e)=>setinstagram({status:e.target.value,link:instagram.link})}>
                <option value='active'>Activate</option>
                <option value='inactive'>Deactivate</option>
            </select>
        </div>
        <div className='adminLinksInput'>
            <p>Instagram Link</p>
            <input type='text' value={instagram.link} onChange={(e)=>setinstagram({status:instagram.status,link:e.target.value})}/>
        </div>
        </div>
        </div>



        <div className='admineditnamecon2'>
        <div className='admineditname'>
        <p>Priveledges</p>
        <MultiSelect
        options={options}
        value={selectedOption}
        onChange={setselectedOption}
        labelledBy="Select"
        disableSearch={true}
        />
        </div>
        </div>
      



        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Thumbnail(Image)</p>

            <div className='previewimg'>
            <img src={imgpreview}/>
            </div>

            <input type='file' name='img_link' onChange={imgPreview}/>

        </div>
        </div>

        <div className='admineditnamecon'>
            <div className='admineditname'>
            <p>Status</p>
            <select name='status'>
            <option value='active'>Activate</option>
            <option value='inactive'>Deactivate</option>
            </select>
            </div>
        </div>
        <div className='admineditbtn'>
        <button >ADD</button>
        </div>
        </div>
        </form>  
        </>
    )
}