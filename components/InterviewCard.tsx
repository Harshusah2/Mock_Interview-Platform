import { getRandomInterviewCover } from '@/lib/utils';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import DisplayTechIcons from './DisplayTechIcons';
import { getFeedbackByinterviewId } from '@/lib/actions/general.action';

const InterviewCard = async ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {

    const feedback = userId && id ? await getFeedbackByinterviewId({
      interviewId: id, userId
    }) : null;

    // in this "g" is for global and "i" is for case-insensitive matching
    const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

    // it allows us to format the date in a more readable way
    const formatedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM DD, YYYY");

  return (
    <div className='card-border w-[360px] max-sm:w-full min-h-96'>
      <div className='card-interview'>
        <div>
            <div className='absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600 font-semibold'>
                <p className='badge-text'>{normalizedType}</p>
            </div>

            <Image 
              src={getRandomInterviewCover()} 
              alt="cover-image" 
              width={90} 
              height={90} 
              className='rounded-full object-fit size-[90px]' 
            />

            <h3 className='mt-5 capitalize'>
              {role} Interview
            </h3>

            <div className='flex flex-row gap-5 mt-3'>
              <div className='flex flex-row gap-2'>
                <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
                <p>{formatedDate}</p>
              </div>

              <div className="flex flex-row gap-2 items-center">
                <Image src="/star.svg" alt="star"  width={22} height={22} />
                <p>{feedback?.totalScore || "---"}/100</p>
              </div>
            </div>

            <p className="line-clamp-2 mt-5">
              {feedback?.finalAssessment || "You haven't taken this interview yet. Take it now to improve your skills!"}
            </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary">
            <Link href={feedback
              ? `/interview/${id}/feedback`
              : `/interview/${id}`
            }>
              {feedback ? "View Feedback" : "Take Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default InterviewCard