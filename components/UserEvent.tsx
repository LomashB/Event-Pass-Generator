import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'

interface EventDetailsProps {
  event: {
    title: string
    subtitle: string
    description: string
    date: string
    time: string
    venue: string
    speakers: { name: string; title: string }[]
  }
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-orange-600">{event.title}</h1>
      <h2 className="text-2xl font-semibold text-orange-500">{event.subtitle}</h2>
      <p className="text-lg text-gray-600">{event.description}</p>
      <div className="space-y-2">
        <div className="flex items-center">
          <CalendarDays className="w-5 h-5 mr-2 text-orange-500" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2 text-orange-500" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-orange-500" />
          <span>{event.venue}</span>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Speakers:</h3>
        <ul className="space-y-2">
          {event.speakers.map((speaker, index) => (
            <li key={index} className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-orange-500" />
              <div>
                <span className="font-medium">{speaker.name}</span>
                <span className="text-sm text-gray-600 ml-2">({speaker.title})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}