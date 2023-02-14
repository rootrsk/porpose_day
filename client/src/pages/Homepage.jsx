import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getProposal, updateProposalStatus } from '../utils'
function Homepage() {
    const [proposal,setProposal] = useState(null)
    const [proposalStatus,setProposalStatus] = useState(null)
    const [terms,setTerms] = useState(null)
    const [q,setQ] = useState(null)
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location)
    const query = location.search
    console.log(query)
    useEffect(()=>{
        
        (async()=>{
            if(query.split('?q=')?.[1]){
                setQ(query.split('?q=')?.[1])
                const data = await getProposal(query?.split('?q=')?.[1])
                if(data?.error){
                    return alert(data?.error)
                }
                if(data?.user){
                    setProposal(data)
                }
                console.log(data)
            }else{
                setProposal(null)
                setProposalStatus(null)
                setTerms(null)
                setQ(null)
            }
            
        })()
    },[query])
    const accectHandler = async()=>{
        
        const data = await updateProposalStatus({
            token : query?.split('?q=')?.[1],
            proposal:"Accepted"
        })
        if(data?.error){
            return alert(data?.error)
        }
        setProposalStatus("accepted")
        console.log(data)

    }
    const termAccectHandler = async()=>{
        
        const data = await updateProposalStatus({
            token : query?.split('?q=')?.[1],
            proposal:"Accepted",
            terms_and_conditons:"Accepted"
        })
        if(data?.error){
            return alert(data?.error)
        }
        setProposalStatus("accepted")
        setTerms("accepted")
        console.log(data)

    }
    const rejectHandler = async()=>{
        const data = await updateProposalStatus({
            token : query?.split('?q=')?.[1],
            proposal:"Rejected"
        })
        if(data?.error){
            return alert(data?.error)
        }
        console.log(data)
        setProposalStatus("rejected")
        // setTimeout(() => {
        //     navigate('/')
        // }, 5000);
    }
    const termRejectHandler = async()=>{
        const data = await updateProposalStatus({
            token : query?.split('?q=')?.[1],
            terms_and_conditons:"Rejected",
            proposal:"Accepted"
        })
        if(data?.error){
            return alert(data?.error)
        }
        console.log(data)
        // setTimeout(() => {
        //     navigate('/')
        // }, 5000);
        setProposalStatus("rejected")
    }
    return (
        <div>
            {
                !q && 
                <div className="about">
                    <h2>Propose Your Crush</h2>
                    <button className="btn btn-primary" onClick={()=>navigate('/create-new')}>
                        Start Now
                    </button>
                    <footer className='footer'>
                        <p>Developoed By Ravishankar.</p>
                    </footer>
                </div>  
            }
            {proposal && proposal.user && 
                <div className='proposal_home'>
                    <h2>You have been proposed by {proposal?.user?.showname}</h2>
                    <p 
                        className='cheese_line text-clip'>
                        "{proposal?.user?.cheese_line}"
                    </p>
                    <div className='add-button'>
                        <button 
                            className='btn btn-success'
                            onClick={accectHandler}
                        >
                            Accept
                        </button>
                        <button
                            className='btn btn-danger'
                            onClick={rejectHandler}
                        >
                            Reject
                        </button>
                    </div>
                    <img className="image_f" src="https://media.tenor.com/905u0Gsct30AAAAj/tkthao219-bubududu.gif" alt="" />
                </div>

            }
            {
                proposal && proposal.user && true && 
                <div className={`show-terms ${proposalStatus==="accepted"?'slider':''}`}>
                    <h3>Promises</h3>
                    <div className="promises">
                        {
                            proposal?.user?.terms_and_conditions?.map((term,idx)=>{
                                return <li key={idx+1}>
                                    <span>{idx+1}. </span>
                                    {term}
                                </li>
                            })
                        }    
                    </div>
                    
                    <img src="https://media.tenor.com/JLMnejbPZeEAAAAj/heart-love-you.gif" alt="" />
                    <div className="add-button">
                        <button 
                            className='btn btn-success'
                            onClick={termAccectHandler}
                        >
                            Accept
                        </button>
                        <button
                            className='btn btn-danger'
                            onClick={termRejectHandler}
                        >
                            Reject
                        </button>
                    </div>
                </div> 
            }
            {
                proposal && proposal.user && proposalStatus==="rejected" && 
                <div className='show-terms-broken'>
                    <img 
                        src="https://media.tenor.com/zhy7eq_NWkUAAAAi/heart-break.gif" 
                        alt=""
                        className='broken-heart' 
                    />
                </div>
            }
            {
                proposal && proposal.user && (proposalStatus==="rejected" || terms==="rejected") && 
                <div className='show-terms-broken'>
                    <img 
                        src="https://media.tenor.com/zhy7eq_NWkUAAAAi/heart-break.gif" 
                        alt=""
                        className='broken-heart' 
                    />
                </div>
            }
            {
                proposal && proposal.user && (proposalStatus==="accepted" && terms==="accepted") && 
                <div className='show-terms-joined'>
                    <img 
                        src="https://media.tenor.com/4vEeYzBwLu4AAAAi/turning-hugging.gif" 
                        alt=""
                        className='broken-heart' 
                    />
                    
                    <a 
                        href={'https://www.instagram.com/'+proposal?.user?.instagram}
                    >
                        <img src="https://i.ibb.co/VjfRhCG/icons8-instagram-240.png" alt="" />
                        <p>Let's connect</p>
                    </a>
                </div>
            }
            
        </div>
    )
}

export default Homepage