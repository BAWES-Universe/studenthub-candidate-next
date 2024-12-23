import { CandidateNotification } from "@/models/candidate-notification";
import WorkHourRejected from "./work-hour-rejected";
import WorkHourApproved from "./work-hour-approved";
import WorkSessionApproved from "./work-session-approved";
import WorkSessionRejected from "./work-session-rejected";
import InvitationNotification from "./invitation-notification";
import Assigned from "./assigned";
import Unassigned from "./unassigned";
import TransferInit from "./transfer-init";
import TransferPaid from "./transfer-paid";
import TransferUnpaid from "./transfer-unpaid";

export function Activity({candidateNotification, markRead}: {candidateNotification: CandidateNotification, markRead: any}) {
    return (

        <div className="mb-4" key={candidateNotification.cn_uuid}>
        {
        candidateNotification.type == 3 ? <WorkHourApproved 
onClick={() => markRead(candidateNotification)}
candidateNotification={candidateNotification}></WorkHourApproved>: null
        } 
  
        {
            candidateNotification.type == 4 ? <WorkHourRejected 
    onClick={() => markRead(candidateNotification)}
      candidateNotification={candidateNotification}></WorkHourRejected>: null 
        }

        {
            candidateNotification.type == 8 ? <WorkSessionApproved 
    onClick={() => markRead(candidateNotification)}
    candidateNotification={candidateNotification}></WorkSessionApproved>: null}
      
  {
            candidateNotification.type == 9 ? <WorkSessionRejected 
    onClick={() => markRead(candidateNotification)}
      candidateNotification={candidateNotification}></WorkSessionRejected>: null }
      
  {
            candidateNotification.type == 0 ? <InvitationNotification 
    onClick={() => markRead(candidateNotification)}
      candidateNotification={candidateNotification}></InvitationNotification>: null
  }

  {
            candidateNotification.type == 1 ? <Assigned 
  onClick={() => markRead(candidateNotification)}
    candidateNotification={candidateNotification}></Assigned>: null
  }
  
  {
            candidateNotification.type == 2 ? <Unassigned 
  onClick={() => markRead(candidateNotification)}
      candidateNotification={candidateNotification}></Unassigned>: null }

  {
            candidateNotification.type == 5 ? <TransferInit 
  onClick={() => markRead(candidateNotification)}
      candidateNotification={candidateNotification}></TransferInit>: null
  }

  {
            candidateNotification.type == 6 ? <TransferPaid 
  onClick={() => markRead(candidateNotification)}
      candidateNotification={candidateNotification}></TransferPaid>: null
  }

  {
            candidateNotification.type == 7 ? <TransferUnpaid 
  onClick={() => markRead(candidateNotification)}
      candidateNotification={candidateNotification}></TransferUnpaid>: null
  }

  { /*
            candidateNotification.type == 10 ? <ion-card *ngSwitchDefault tappable
  onClick={() => markRead(candidateNotification)}
    candidateNotification={candidateNotification}> 
    <ion-card-content>
      {{ candidateNotification.message }}
    </ion-card-content>
  </ion-card>: null */ }

    </div> 
    )
}