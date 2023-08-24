import axios from 'axios';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official';
import {useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import { baseUrl, phpUrl } from '../../components/BaseUrl';
import { ThreeDots } from 'react-loader-spinner'

export const getServerSideProps=async (context)=>{
    let error=context.query;
    try{
      const res=await axios.get(`${phpUrl}/analytics/get-analytics.php`);

      const data=res.data.data;
      const viewsCount= data.views;
      const articlesCount= data.articles;
      const categoriesCount= data.categories;
      
      return {
        props:{viewsCount,articlesCount,categoriesCount}
      }    
      
    }catch(err){
      return {
        props:{error:err}
      } 
    }
    
  }

export default function Admin({error,articlesCount,categoriesCount,viewsCount}){
    const [viewCurrentYear,setviewCurrentYear]=useState(null);
    const [viewCurrentMonth,setviewCurrentMonth]=useState(null);
    const [likeCurrentYear,setlikeCurrentYear]=useState(null);
    const [likeCurrentMonth,setlikeCurrentMonth]=useState(null);
    const [viewStat,setviewStat]=useState({week1:[],week2:[],week3:[],week4:[],week5:[]});
    const [likeStat,setlikeStat]=useState({week1:[],week2:[],week3:[],week4:[],week5:[]});
    const [dataLoad1,setdataLoad1]=useState(true);
    const [dataLoad2,setdataLoad2]=useState(true);

    if(error){
        Swal.fire(
          'Error Occured',
          'Please check your connection',
          'error'
        )
  }



    function getViewStat(){
        setdataLoad1(true);
    axios.get(`${phpUrl}/analytics/get-views-stat.php?month=${viewCurrentMonth}&year=${viewCurrentYear}`)
    .then(res=>{
        let status=res.data.status;
        let data=res.data.data;

        if(status==='success'){
            let week1=[]
            let week2=[]
            let week3=[]
            let week4=[]
            let week5=[]
            for (let i = 0; i < data.length; i++) { 
            if(data[i].day >= 1 && data[i].day <= 7){
                week1.push(data[i])
            }else if(data[i].day >= 8 && data[i].day <= 14){
                week2.push(data[i])
            }else if(data[i].day >= 15 && data[i].day <= 21){
                week3.push(data[i])
            }else if(data[i].day >= 22 && data[i].day <= 28){
                week4.push(data[i])
            }else if(data[i].day >= 29 && data[i].day <= 31){
                week5.push(data[i])
            }                   
            }
            setdataLoad1(false);

setviewStat({['week1']:week1,['week2']:week2,['week3']:week3,['week4']:week4,['week5']:week5});

        }else{
            setdataLoad1(false)
            Swal.fire(
                'Error Occured',
                status,
                'warning'
            )
        }
    }).catch(err=>{
        setdataLoad1(false)
        Swal.fire(
            'Error Occured',
            err.message,
            'error'
        )
    })
}




        function getLikeStat(){
            setdataLoad2(true);
            axios.get(`${phpUrl}/analytics/get-likes-stat.php?month=${likeCurrentMonth}&year=${likeCurrentYear}`)
            .then(res=>{
                let status=res.data.status;
                let data=res.data.data;

                if(status==='success'){
                    let week1=[]
                    let week2=[]
                    let week3=[]
                    let week4=[]
                    let week5=[]
                  for (let i = 0; i < data.length; i++) { 
                    if(data[i].day >= 1 && data[i].day <= 7){
                        week1.push(data[i])
                    }else if(data[i].day >= 8 && data[i].day <= 14){
                        week2.push(data[i])
                    }else if(data[i].day >= 15 && data[i].day <= 21){
                        week3.push(data[i])
                    }else if(data[i].day >= 22 && data[i].day <= 28){
                        week4.push(data[i])
                    }else if(data[i].day >= 29 && data[i].day <= 31){
                        week5.push(data[i])
                    }                   
                  }
                  setdataLoad2(false)
    setlikeStat({['week1']:week1,['week2']:week2,['week3']:week3,['week4']:week4,['week5']:week5});

                }else{
                    setdataLoad2(false);
                    Swal.fire(
                        'Error Occured',
                        status,
                        'warning'
                    )
                }
            }).catch(err=>{
                setdataLoad2(false)
                Swal.fire(
                    'Error Occured',
                    err.message,
                    'error'
                )
            })
        }


        function setTime(){
            const dateNow=new Date();
            setviewCurrentMonth(dateNow.getMonth()+1);
            setviewCurrentYear(dateNow.getFullYear())
            setlikeCurrentMonth(dateNow.getMonth()+1);
            setlikeCurrentYear(dateNow.getFullYear())
        }


        

    const options  = {
        title: {
          text: ''
        },
        chart:{
        type:'column'
        },
        xAxis:{
        categories:['Week 1','Week 2','Week 3','Week 4','Week 5']
        },
        yAxis:{
        title:{
            text:''
        }
        },
        series: [{
        name:'Views',
        data: [viewStat.week1.length, viewStat.week2.length, viewStat.week3.length,viewStat.week4.length,viewStat.week5.length]
        }],
        accessibility:{
            enabled:false
        },
        credits:false
      }

      const options2 = {
        title: {
          text: ''
        },
        chart:{
        type:'pie'
        },
        series: [{
            name:'Likes',
          data: [{
            name:'week1',
            y: likeStat.week1.length,
          }, 
          {
            name:'week2',
            y: likeStat.week2.length,
          }, 
          {
            name:'week3',
            y: likeStat.week3.length,
          },
          {
            name:'week4',
            y: likeStat.week4.length,
          },
          {
            name:'week5',
            y: likeStat.week5.length,
          }]
        }],
        accessibility:{
            enabled:false
        },
        credits:false
      }

   
useEffect(()=>{
setTime();
},[])

useEffect(()=>{
    getViewStat();
},[viewCurrentMonth,viewCurrentYear])

useEffect(()=>{
    getLikeStat();
},[likeCurrentMonth,likeCurrentYear])


    return(
        <>
            <div className='mainHeading'><p>Dashboard</p></div>


            <div className='adminstat1con'>
            <div className='adminstat1'>
                <div className='adminstat1icon'>
                    <div style={{background:'rgba(255, 69, 0,0.4)',color:'rgb(255, 69, 0)'}}>
                        <i className='fa fa-support'/></div>
                </div>
                <div className='adminstat1details'>
                <p>Total Views</p>
                <p>{viewsCount}</p>
                </div>
            </div>

            <div className='adminstat1'>
                <div className='adminstat1icon'>
                <div style={{background:'rgba(30, 144, 255,0.4)',color:'rgb(30, 144, 255)'}}>
                        <i className='fa fa-support'/></div>
                </div>
                <div className='adminstat1details'>
                <p>Total Categories</p>
                <p>{categoriesCount}</p>
                </div>
            </div>

            <div className='adminstat1'>
                <div className='adminstat1icon'>
                <div style={{background:'rgba(60, 179, 113,0.4)',color:'rgb(60, 179, 113)'}}>
                        <i className='fa fa-support'/></div>
                </div>
                <div className='adminstat1details'>
                <p>Total Articles</p>
                <p>{articlesCount}</p>
                </div>
            </div>
        </div>





        <div className='adminstat2con'>
            <div className='adminstat2'>
                <div className='adminstat2heading'><p>Views Statistics</p></div>
                <div className='adminstat2stat'>

                <HighchartsReact
                highcharts={Highcharts}
                options={options}
                />
                {dataLoad1&&<ThreeDots
                height="40" 
                width="40" 
                radius="9"
                color="#945f0f" 
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
                />}
                </div>
                <div className='chartfilterscon'>
    <div className='chartInfo'>Week 1 <p>(1th - 7th)</p></div>
    <div className='chartInfo'>Week 2 <p>(8th - 14th)</p></div>
    <div className='chartInfo'>Week 3 <p>(15th - 21th)</p></div>
    <div className='chartInfo'>Week 4 <p>(22th - 28th)</p></div>
    <div className='chartInfo'>Week 5 <p>(29th - 31th)</p></div>
                </div>
                <div className='chartfilterscon'>
                    <select value={viewCurrentYear} onChange={(e)=>setviewCurrentYear(e.target.value)}>
                    <option value='2018'>2018</option>
                    <option value='2019'>2019</option>
                    <option value='2020'>2020</option>
                    <option value='2021'>2021</option>
                    <option value='2022'>2022</option>
                    <option value='2023'>2023</option>
                    <option value='2024'>2024</option>
                    <option value='2025'>2025</option>
                    <option value='2026'>2026</option>
                    <option value='2027'>2027</option>
                    </select>
                    <select value={viewCurrentMonth} onChange={(e)=>setviewCurrentMonth(e.target.value)}>
                    <option value='1'>January</option>
                    <option value='2'>February</option>
                    <option value='3'>March</option>
                    <option value='4'>April</option>
                    <option value='5'>May</option>
                    <option value='6'>June</option>
                    <option value='7'>July</option>
                    <option value='8'>August</option>
                    <option value='9'>September</option>
                    <option value='10'>October</option>
                    <option value='11'>November</option>
                    <option value='12'>December</option>
                    </select>
                </div>
            </div>

            <div className='adminstat2'>
                <div className='adminstat2heading'><p>Likes Statistics</p></div>
                <div className='adminstat2stat'>

                <HighchartsReact
                highcharts={Highcharts}
                options={options2}
                />
                {dataLoad1&&<ThreeDots
                height="40" 
                width="40" 
                radius="9"
                color="#945f0f" 
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
                />}
                </div>
                <div className='chartfilterscon'>
    <div className='chartInfo'>Week 1 <p>(1th - 7th)</p></div>
    <div className='chartInfo'>Week 2 <p>(8th - 14th)</p></div>
    <div className='chartInfo'>Week 3 <p>(15th - 21th)</p></div>
    <div className='chartInfo'>Week 4 <p>(22th - 28th)</p></div>
    <div className='chartInfo'>Week 5 <p>(29th - 31th)</p></div>
                </div>
                <div className='chartfilterscon'>
                <select value={likeCurrentYear} onChange={(e)=>setlikeCurrentYear(e.target.value)}>
                    <option value='2018'>2018</option>
                    <option value='2019'>2019</option>
                    <option value='2020'>2020</option>
                    <option value='2021'>2021</option>
                    <option value='2022'>2022</option>
                    <option value='2023'>2023</option>
                    <option value='2024'>2024</option>
                    <option value='2025'>2025</option>
                    <option value='2026'>2026</option>
                    <option value='2027'>2027</option>
                    </select>
                    <select value={likeCurrentMonth} onChange={(e)=>setlikeCurrentMonth(e.target.value)}>
                    <option value='1'>January</option>
                    <option value='2'>February</option>
                    <option value='3'>March</option>
                    <option value='4'>April</option>
                    <option value='5'>May</option>
                    <option value='6'>June</option>
                    <option value='7'>July</option>
                    <option value='8'>August</option>
                    <option value='9'>September</option>
                    <option value='10'>October</option>
                    <option value='11'>November</option>
                    <option value='12'>December</option>
                    </select>
                </div>
            </div>

        </div>
        </>
    )
}