'use server'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(LocalizedFormat)
dayjs.extend(relativeTime)

const dayts = dayjs

export default dayts