import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async () => {

  const user = await getCurrentUser();

  // for optimization, we can use Promise.all to fetch both user interviews and latest interviews concurrently at the same time
  // This will reduce the overall time taken to fetch both data sets
  // If we don't use Promise.all, it will wait for the first query to finish before starting the second query
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! })
  ]);
  
  const hasPastInterviews = (userInterviews ?? []).length > 0;
  const hasUpcomingInterviews = (latestInterviews ?? []).length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>

          <p className='text-lg'>
            Practice coding interviews with AI-generated questions, receive instant feedback, and improve your skills with personalized insights. Join now to enhance your interview performance and land your dream job!
          </p>

          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image src="/robot.png" alt="robot-buddy" width={400} height={400} className='max-sm:hidden' />
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Your Interviews</h2>

        <div className='interviews-section'>
          {
            hasPastInterviews ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>You haven't taken any interviews yet</p>
            )
          }
        </div>
      </section>

      <section className='flex flex-col gap-6 mt-8'>
        <h2>Take an Interview</h2>

        <div className='interviews-section'>
          {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>There are no new interviews available</p>
            )
          }
        </div>
      </section>
    </>
  )
}

export default page