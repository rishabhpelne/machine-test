"use client";

import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Calendars from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 

import {
  formatDate,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Calendar: React.FC = () => {
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newEventTitle, setNewEventTitle] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<DateSelectArg | null>(null);
  const [activeMenu, setActiveMenu] = useState<string>("calendar");
  const [activeTab, setActiveTab] = useState('All');
  const [value, setValue] = useState(new Date());

  const onChange = (nextValue) => {
    setValue(nextValue);
  };

  const tabs = ['All', 'Listening', 'Learning', 'Rehearsal', 'Perform'];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEvents = localStorage.getItem("events");
      if (savedEvents) {
        setCurrentEvents(JSON.parse(savedEvents));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("events", JSON.stringify(currentEvents));
    }
  }, [currentEvents]);

  const handleDateClick = (selected: DateSelectArg) => {
    setSelectedDate(selected);
    setIsDialogOpen(true);
  };

  const handleEventClick = (selected: EventClickArg) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event "${selected.event.title}"?`
      )
    ) {
      selected.event.remove();
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewEventTitle("");
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle && selectedDate) {
      const calendarApi = selectedDate.view.calendar;
      calendarApi.unselect();

      const newEvent = {
        id: `${selectedDate.start.toISOString()}-${newEventTitle}`,
        title: newEventTitle,
        start: selectedDate.start,
        end: selectedDate.end,
        allDay: selectedDate.allDay,
      };

      calendarApi.addEvent(newEvent);
      handleCloseDialog();
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 h-screen flex flex-col">
  <ul className="mt-4">
    <li
      className={`p-4 cursor-pointer ${
        activeMenu === "calendar" ? "bg-orange-100" : ""
      }`}
      onClick={() => setActiveMenu("calendar")}
    >
      <i className="fas fa-calendar-alt mr-2"></i> Home
    </li>
    <li
      className={`p-4 cursor-pointer ${
        activeMenu === "profile" ? "bg-orange-100" : ""
      }`}
      onClick={() => setActiveMenu("profile")}
    >
      <i className="fas fa-user mr-2"></i> Profile
    </li>
    <li
      className={`p-4 cursor-pointer ${
        activeMenu === "library" ? "bg-orange-100" : ""
      }`}
      onClick={() => setActiveMenu("library")}
    >
      <i className="fas fa-book mr-2"></i> Library
    </li>
    <li className="p-4 cursor-pointer">
      <i className="fas fa-folder mr-2"></i> Collection
      <ul className="pl-4 mt-2 space-y-2">
        <li
          className={`cursor-pointer ${
            activeMenu === "submenu1" ? "bg-orange-100" : ""
          }`}
          onClick={() => setActiveMenu("submenu1")}
        >
          <i className="fas fa-music mr-2"></i> Playlists
        </li>
        <li
          className={`cursor-pointer ${
            activeMenu === "submenu2" ? "bg-orange-100" : ""
          }`}
          onClick={() => setActiveMenu("submenu2")}
        >
          <i className="fas fa-microphone-alt mr-2"></i> Tracks
        </li>
        <li
          className={`cursor-pointer ${
            activeMenu === "submenu3" ? "bg-orange-100" : ""
          }`}
          onClick={() => setActiveMenu("submenu3")}
        >
          <i className="fas fa-user-friends mr-2"></i> Artists
        </li>
        <li
          className={`cursor-pointer ${
            activeMenu === "submenu4" ? "bg-orange-100" : ""
          }`}
          onClick={() => setActiveMenu("submenu4")}
        >
          <i className="fas fa-record-vinyl mr-2"></i> Albums
        </li>
        <li
          className={`cursor-pointer ${
            activeMenu === "submenu5" ? "bg-orange-100" : ""
          }`}
          onClick={() => setActiveMenu("submenu5")}
        >
          <i className="fas fa-list mr-2"></i> Genres
        </li>
        <li
          className={`cursor-pointer ${
            activeMenu === "submenu6" ? "bg-orange-100" : ""
          }`}
          onClick={() => setActiveMenu("submenu6")}
        >
          <i className="fas fa-calendar-alt mr-2"></i> Decades
        </li>
        <li
          className={`cursor-pointer ${
            activeMenu === "submenu7" ? "bg-orange-100" : ""
          }`}
          onClick={() => setActiveMenu("submenu7")}
        >
          <i className="fas fa-globe mr-2"></i> Geos
        </li>
      </ul>
    </li>
    <li
      className={`p-4 cursor-pointer ${
        activeMenu === "community" ? "bg-orange-100" : ""
      }`}
      onClick={() => setActiveMenu("community")}
    >
      <i className="fas fa-users mr-2"></i> Community
    </li>
  </ul>
</div>


      {/* Main Content */}
      <div className="w-full">
        {/* Top Navbar */}
        <div className="p-4 flex justify-between items-center mt-5 mx-5">
      <ul className="flex space-x-12">
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`cursor-pointer p-1 px-3 ${
              activeTab === tab ? 'bg-orange-300 text-white' : ''
            }`}
            onClick={() => setActiveTab(tab)} // Set active tab on click
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>

        {/* Calendar and Events */}
        <div className="p-8 box-shadow">
          <div className="flex">

            <div className="w-9/12">
              <FullCalendar
                height={"85vh"}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={handleDateClick}
                eventClick={handleEventClick}
                eventsSet={(events) => setCurrentEvents(events)}
                initialEvents={
                  typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("events") || "[]")
                    : []
                }
              />
            </div>

            <div className="w-3/12 p-4 pt-0 bg-white shadow-lg rounded-lg">
      <Calendars 
        onChange={onChange}
        value={value}
        className="mx-auto"
      />
    </div>
          </div>
        </div>
      </div>

      {/* Dialog for adding new events */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event Details</DialogTitle>
          </DialogHeader>
          <form className="space-x-5 mb-4" onSubmit={handleAddEvent}>
            <input
              type="text"
              placeholder="Event Title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              required
              className="border border-gray-200 p-3 rounded-md text-lg"
            />
            <button
              className="bg-orange-300 text-white p-3 mt-5 rounded-md"
              type="submit"
            >
              Add
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
