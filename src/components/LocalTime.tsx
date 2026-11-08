import { useEffect, useState } from 'react'
import { site } from '../content/site'

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: site.timeZone,
  hour: '2-digit',
  minute: '2-digit',
})

/** Current time in Lebanon, a small real detail instead of decoration. */
export function LocalTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000)
    return () => window.clearInterval(id)
  }, [])
  return (
    <time dateTime={now.toISOString()} className="tabular-nums">
      {fmt.format(now)}
    </time>
  )
}
