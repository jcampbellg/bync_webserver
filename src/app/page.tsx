import dayts from '@/utils/daytz'

export default function Home() {
  return (
    <main className='font-mono'>
      <div>
        Server Time: {dayts().format('LLLL')}
      </div>
      <div>
        Status: OK
      </div>
    </main>
  )
}
