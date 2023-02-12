import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getProposal, updateProposalStatus } from '../utils'
function Homepage() {
    const [proposal,setProposal] = useState(null)
    const [proposalStatus,setProposalStatus] = useState(null)
    const [terms,setTerms] = useState(null)
    const location = useLocation()
    console.log(location)
    const query = location.search
    console.log(query)
    useEffect(()=>{
        (async()=>{
            const data = await getProposal(query?.split('?q=')?.[1])
            if(data?.error){
                return alert(data?.error)
            }
            if(data?.user){
                setProposal(data)
            }
            console.log(data)
        })()
    },[])
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
        setProposalStatus("rejected")
    }
    return (
        <div>
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
                </div>

            }
            {
                proposal && proposal.user && proposalStatus==="accepted" && 
                <div className='show-terms'>
                    <h3>Agreements</h3>
                    {
                        proposal?.user?.terms_and_conditions?.map((term,idx)=>{
                            return <li key={idx+1}>
                                <span>{idx+1}. </span>
                                {term}
                            </li>
                        })
                    }
                    <img src="https://media.tenor.com/JLMnejbPZeEAAAAj/heart-love-you.gif" alt="" />
                    <div>
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
            
        </div>
    )
}

export default Homepage