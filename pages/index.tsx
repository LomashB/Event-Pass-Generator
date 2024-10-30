'use client'

import { useState } from "react"
import Image from "next/image"
import { EventDetails } from "../components/EventDetails"
import { RegisterButton } from "../components/RegisterButton"
import { RegisterPopup } from "../components/RegisterPopup"
import UserIdCard from "../components/UserVisitorPass"
import { X } from "lucide-react"
import LoaderOrg from "../components/LoaderOrg"
import Head from 'next/head'

interface EventData {
  id: string
  title: string
  startDate: string
  endDate: string
  status: string
  venue: string
  imageUrl: string
}

interface RegisterData {
  name: string
  photo: string
}

export default function Component() {
  const staticEventData: EventData = {
    id: "fulvadi",
    title: "Fulvadi Mandir Kalash Dhwaja Rajat Mahotsav",
    startDate: "November 10, 2024",
    endDate: "November 12, 2024",
    status: "Active",
    venue: "Fulvadi Mandir, Jamvanthali, Jamnagar",
    imageUrl: "/fulvadi-invite-web.png",
  }

  const [eventData] = useState<EventData>(staticEventData)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [registeredUser, setRegisteredUser] = useState<RegisterData | null>(null)
  const [visitorPassPopup, setVisitorPassPopup] = useState(false)

  const handleRegister = (data: RegisterData) => {
    setRegisteredUser(data)
    setIsPopupOpen(false)
    setVisitorPassPopup(true)
  }

  if (!eventData)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <LoaderOrg />
      </div>
    )

  return (
    <>
      <Head>
        <title>Fulvadi Mandir Kalash Dhwaja Rajat Mahotsav</title>
        <meta name="description" content="Join us for the Fulvadi Mandir Kalash Dhwaja Rajat Mahotsav from November 10-12, 2024 at Fulvadi Mandir, Jamvanthali, Jamnagar." />
        <meta property="og:title" content="Fulvadi Mandir Kalash Dhwaja Rajat Mahotsav" />
        <meta property="og:description" content="Join us for the Fulvadi Mandir Kalash Dhwaja Rajat Mahotsav from November 10-12, 2024 at Fulvadi Mandir, Jamvanthali, Jamnagar." />
        <meta property="og:image" content="/fulvadi-invite-web.png" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fulvadi Mandir Kalash Dhwaja Rajat Mahotsav" />
        <meta name="twitter:description" content="Join us for the Fulvadi Mandir Kalash Dhwaja Rajat Mahotsav from November 10-12, 2024 at Fulvadi Mandir, Jamvanthali, Jamnagar." />
        <meta name="twitter:image" content="/fulvadi-invite-web.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200">
        <div className="container mx-auto px-4 py-4">
          <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="md:flex">
              <div className="md:w-7/12">
                <div className="relative w-full md:w-90%">
                  <Image
                    src={eventData.imageUrl}
                    alt="Event Image"
                    layout="responsive"
                    width={90}
                    height={100}
                    objectFit="contain"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
              <div className="md:w-5/12 flex align-center flex-col justify-center p-8">
                <h1 className="mb-6 text-3xl text-center font-bold text-orange-600">{eventData.title}</h1>
                <EventDetails event={eventData} />
                {!registeredUser ? (
                  <RegisterButton onClick={() => setIsPopupOpen(true)} />
                ) : (
                  <button
                    onClick={() => setVisitorPassPopup(true)}
                    className="mt-6 w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-white font-semibold shadow-md hover:from-orange-600 hover:to-orange-700 transition duration-300 ease-in-out"
                  >
                    Download Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {isPopupOpen && (
          <RegisterPopup onClose={() => setIsPopupOpen(false)} onRegister={handleRegister} />
        )}
        {registeredUser && visitorPassPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-orange-600">Your Registration ID:</h2>
                <button
                  onClick={() => setVisitorPassPopup(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <UserIdCard onClose={() => setVisitorPassPopup(false)} data={registeredUser} />
            </div>
          </div>
        )}
      </div>
      <footer className="bg-orange-100  text-black text-center py-3">
        <div className="container mx-auto">
          <p className="text-sm text-black ">
            &copy; 2024 Fulvadi Mandir. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}