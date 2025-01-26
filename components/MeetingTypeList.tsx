'use client';
import React, { useState } from 'react'; 
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModel from './MeetingModel';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from "@clerk/nextjs";
import { Toast } from "@/components/ui/toaster";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import ReactDatePicker  from 'react-datepicker';


const MeetingTypeList = () => {

  
  const router = useRouter();

  
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >(); 

  const { user } = useUser();
  const client = useStreamVideoClient()
  const [value, setvalue] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })

  const [callDetails, setCallDetails] = useState<Call>();

  const { toast } = useToast();

  const createMeeting = async () => {
    if(!client || !user) return ;

    try{
      if(!value.dateTime){
        toast({
          title: 'Please select date and time'
        })
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if(!call) throw new Error('Failed to create call')

      if(!call) throw new Error ('Failed to create call')
        
        const startsAt = value.dateTime.toISOString() || new Date().toISOString(); 
        const description = value.description || 'Instant Meeting';

        await call.getOrCreate({
          date:{
            starts_at: startsAt,
            custom:{
              description
            }
          }
        })

        setCallDetails(call)

        if(!value.description) {
          router.push(`/meeting/${call.id}`)
        }

        toast({ title: "Meeting Created Successfully" })
    }
    catch(error){
      console.log(error);
      toast({
        title: "Failed to create meeting"
      })
    }
  }

  return (
    <section className="grid grid-cols-1 gap-5
    md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting') }
        className="bg-orange-1"
      />
      <HomeCard 
      img="/icons/schedule.svg"
      title="Schedule Meeting"
      description="Plan your meetings"
      handleClick={() => setMeetingState('isScheduleMeeting') }
      className="bg-blue-1"
      />
      <HomeCard 
      img="/icons/recordings.svg"
      title="View recording"
      description="Check your recordings"
      handleClick={() => router.push('/recording') }
      className="bg-purple-1"
      />
      <HomeCard 
      img="/icons/join-meeting.svg"
      title="Join Meeting"
      description="Via invitation link"
      handleClick={() => setMeetingState('isJoiningMeeting') }
      className="bg-yellow-1"
      />

      {!callDetails ? (
        <MeetingModel 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose = {() => setMeetingState(undefined)}
        title = "Create Meeting"
        handleClick={createMeeting}
      >
       <div className="flex flex-col gap-2.5">
        <label className="text-base text-normal leading-[22px] text-sky-2">
        Add a description
        </label>
        <Textarea className="border-none bg-dark-3 focus-visible:ring-0
        focus-visible:ring-offset-0"
        onChange={(e) => {
         setvalue({...value, description: e.target.value})
        }}/>
        </div> 
        <div className="flex flex-col gap-2.5">
        <label className="text-base text-normal leading-[22px] text-sky-2">
        Select Date and Time
        </label>
        <ReactDatePicker 
        
        />
        </div>
      </MeetingModel>
      ) : (
        <MeetingModel 
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose = {() => setMeetingState(undefined)}
        title = "Meeting Created"
        className="text-center"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({title: `Link copied`})
        }}

        image="/icons/checked.svg"
        buttonIcon="/icons/copy.svg"
        buttonText="Copy Meeting Link" 
      />
      )}
      <MeetingModel 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose = {() => setMeetingState(undefined)}
        title = "Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
}

export default MeetingTypeList;
