import { CalendarDays, MapPin } from 'lucide-react'

interface EventDetailsProps {
  event: {
    title: string
    startDate: string
    endDate: string
    status: string
    venue: string
  }
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="p-4 md:p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-0 h-0 border-l-[20px] border-l-transparent border-t-[34px] border-t-orange-600 border-r-[20px] border-r-transparent"></div>
          <h1 className="text-2xl font-bold text-gray-800 ">Utsav Details</h1>
        </div>
        <div className="space-y-3">
          <DetailRow icon={CalendarDays} label="START DATE" value={event.startDate} />
          <DetailRow icon={CalendarDays} label="END DATE" value={event.endDate} />
          <DetailRow icon={MapPin} label="VENUE" value={event.venue} />
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center bg-orange-50 p-3 rounded-lg">
      <Icon className="w-6 h-6 text-orange-700 mr-4" />
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-orange-500">{label}</p>
        <p className="text-sm  text-black">{value}</p>
      </div>
    </div>
  )
}