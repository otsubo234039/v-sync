"use client";
import StaffSidebar from "@/components/staff/StaffSidebar";
import NewTaskModal from "@/components/staff/tasks/NewTaskModal";
import TaskColumn from "@/components/staff/tasks/TaskColumn";
import { useStaffTasks } from "@/hooks/useStaffTasks";

export default function StaffTasksPage() {
  const {
    loading,
    backgroundStyle,
    baseTextColor,
    themeMode,
    tasks,
    isModalOpen,
    setIsModalOpen,
    handleAddTask,
    handleDelete
  } = useStaffTasks();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand">LOADING...</div>;

  return (
    <div className={`flex h-screen w-screen font-sans relative overflow-hidden ${baseTextColor}`} style={backgroundStyle}>
      <div className="relative z-10 flex w-full h-full">
        <StaffSidebar />
        
        <main className="flex-1 p-6 h-full flex flex-col overflow-hidden">
          
          <header className="flex justify-between items-end mb-6 shrink-0">
            <div>
              <h2 className="text-xs font-bold tracking-widest mb-1 text-brand">STAFF CONSOLE</h2>
              <h1 className={`text-3xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(var(--brand-rgb),0.3)] ${themeMode === 'dark' ? 'text-white' : 'text-brand'}`}>
                TASKS
              </h1>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-brand hover:brightness-110 text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(var(--brand-rgb),0.4)] transition text-sm"
            >
              + Add Task
            </button>
          </header>

          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden pb-2 min-h-0">
            <TaskColumn 
              title="TO DO" 
              count={tasks.filter(t => t.status === 'todo').length} 
              color="bg-slate-400" 
              tasks={tasks.filter(t => t.status === 'todo')} 
              onDelete={handleDelete} 
            />
            <TaskColumn 
              title="DOING" 
              count={tasks.filter(t => t.status === 'doing').length} 
              color="bg-brand" 
              tasks={tasks.filter(t => t.status === 'doing')} 
              onDelete={handleDelete} 
            />
            <TaskColumn 
              title="DONE" 
              count={tasks.filter(t => t.status === 'done').length} 
              color="bg-blue-500" 
              tasks={tasks.filter(t => t.status === 'done')} 
              onDelete={handleDelete} 
            />
          </div>
        </main>
      </div>
      
      {isModalOpen && <NewTaskModal onClose={() => setIsModalOpen(false)} onAdd={handleAddTask} />}
    </div>
  );
}