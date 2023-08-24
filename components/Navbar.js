import Link from "next/link";
import $ from 'jquery';

export default function Navbar({section,navStatus,setnavStatus,logout}){
    function navbaring2(){
        $('.navbar').css('margin-left','-80%');
        setnavStatus(false)
    }


    return(
        <>
        <div className="navbar">
            <div className="subNav1">
            {section==='Admin' ? <>
            <div><Link href='/'>Home</Link></div>
            <div onClick={navbaring2}><Link href='/admin'>Dashboard</Link></div>
            <div onClick={navbaring2}><Link href='/admin/categories'>Categories</Link></div>
            <div onClick={navbaring2}><Link href='/admin/articles'>Articles</Link></div>
            <div onClick={navbaring2}><Link href='/admin/comments' >Comments</Link></div>
            <div onClick={navbaring2}><Link href='/admin/users'>Users</Link></div>
            <div onClick={navbaring2}><Link href='/admin/staffs'>Staffs</Link></div>
            <div onClick={navbaring2}><Link href='/admin/analytics'>Analytics</Link></div>
            <div onClick={navbaring2}><Link href='/admin/support_system'>Support System</Link></div>
            </>
            : 
            <>
            <div onClick={navbaring2}><Link href='/'>Home</Link></div>
            <div onClick={navbaring2}><Link href='https://ototech22.github.io/OTOTECH-website/about.html'>About Us</Link></div>
            <div onClick={navbaring2}><Link href='https://ototech22.github.io/OTOTECH-website/#service'>Our Services</Link></div>
            <div onClick={navbaring2}><Link href='https://ototech22.github.io/OTOTECH-website/'>Learn More</Link></div>
            <div onClick={navbaring2}><Link href='https://ototech22.github.io/OTOTECH-website/contact.html'>Contact Us</Link></div>
            </>
            }
            </div>
            <div className="subNav2">
            {section==='Admin' ? 
                <button onClick={logout}>Logout</button>
                :
                <Link href='#'>Lets Build your Project</Link>
            }
            </div>
        </div>
        </>
    )
}