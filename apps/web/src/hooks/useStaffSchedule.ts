import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, addDoc, deleteDoc, doc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { CalendarEvent } from "@/models/Schedule";

export const useStaffSchedule = () => {
  const { user, loading } = useAuth();
  const { backgroundStyle, baseTextColor, themeMode } = useTheme();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialDateForModal, setInitialDateForModal] = useState<Date | undefined>(undefined);
  
  const isEditable = true; 

  const fetchData = useCallback(async () => {
    try {
      const allEvents: CalendarEvent[] = [];
      const bookingsSnap = await getDocs(query(collection(db, "bookings")));
      bookingsSnap.forEach(doc => {
        const d = doc.data() as any;
        const start = d.startAt instanceof Timestamp ? d.startAt.toDate() : new Date(d.startAt);
        const end = d.endAt instanceof Timestamp ? d.endAt.toDate() : new Date(d.endAt);
        allEvents.push({ id: doc.id, title: `${d.resourceName} (${d.applicantName})`, type: 'studio', startAt: start, endAt: end, originalData: d });
      });

      const schedulesSnap = await getDocs(query(collection(db, "schedules")));
      schedulesSnap.forEach(doc => {
        const d = doc.data() as any;
        if (d.type === 'stream') return;
        const start = d.startAt instanceof Timestamp ? d.startAt.toDate() : new Date(d.startAt);
        const end = d.endAt instanceof Timestamp ? d.endAt.toDate() : new Date(d.endAt);
        allEvents.push({ id: doc.id, title: d.title, type: d.type === 'meeting' ? 'meeting' : 'event', startAt: start, endAt: end, originalData: d });
      });
      setEvents(allEvents);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddSchedule = async (data: { title: string, type: string, startAt: Date, endAt: Date }) => {
    try {
      await addDoc(collection(db, "schedules"), { userId: "staff", title: data.title, type: data.type, startAt: Timestamp.fromDate(data.startAt), endAt: Timestamp.fromDate(data.endAt), createdAt: Timestamp.now() });
      setIsAddModalOpen(false);
      fetchData();
    } catch (e) { console.error(e); alert("追加に失敗しました"); }
  };

  const handleDeleteSchedule = async () => {
    if (!selectedEvent || !confirm(`「${selectedEvent.title}」を削除しますか？`)) return;
    try {
      const collectionName = selectedEvent.type === 'studio' ? 'bookings' : 'schedules';
      await deleteDoc(doc(db, collectionName, selectedEvent.id));
      setSelectedEvent(null);
      fetchData();
    } catch (e) { console.error(e); alert("削除に失敗しました"); }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const start = new Date(firstDay); start.setDate(start.getDate() - start.getDay()); 
    const end = new Date(lastDay); end.setDate(end.getDate() + (6 - end.getDay()));
    const days = [];
    let d = new Date(start);
    while (d <= end) { days.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return days;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate); newDate.setMonth(newDate.getMonth() + offset); setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => { setInitialDateForModal(date); setIsAddModalOpen(true); };
  const handleHeaderAddClick = () => { setInitialDateForModal(undefined); setIsAddModalOpen(true); };

  return {
    loading,
    backgroundStyle,
    baseTextColor,
    themeMode,
    currentDate,
    changeMonth,
    handleHeaderAddClick,
    getCalendarDays,
    events,
    selectedEvent, setSelectedEvent,
    isAddModalOpen, setIsAddModalOpen,
    initialDateForModal,
    handleDateClick,
    isEditable,
    handleAddSchedule,
    handleDeleteSchedule
  };
};