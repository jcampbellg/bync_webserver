import dayts from '@/utils/daytz'

export default function Home() {
  return (
    <main className='font-mono'>
      <div>
        DayJS: {dayts().format('LLLL')}
      </div>
      <div>
        Date: {new Date().toLocaleString()}
      </div>
      <div>
        Status: OK
      </div>
    </main>
  )
}
