"use client";
import Sidebar from "@/components/admin/Sidebar";
import NewAdminTaskModal from "@/components/admin/NewAdminTaskModal";
import EditAdminTaskModal from "@/components/admin/EditAdminTaskModal";
import TaskColumn from "@/components/admin/tasks/TaskColumn";
import { useAdminTasks } from "@/hooks/useAdminTasks";

export default function TasksPage() {
  const {
    tasks,
    isModalOpen,
    setIsModalOpen,
    selectedTask,
    setSelectedTask,
    fetchTasks,
    addDemoTasks
  } = useAdminTasks();

  const todos = tasks.filter(t => t.status === 'todo');
  const doings = tasks.filter(t => t.status === 'doing');
  const dones = tasks.filter(t => t.status === 'done');

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        <main className="flex-1 p-8 h-screen overflow-hidden flex flex-col">
          
          <header className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <h2 className="text-xs text-purple-500 font-bold tracking-widest mb-1">PROJECT MANAGEMENT</h2>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">TASK BOARD</h1>
            </div>
            
            <div className="flex gap-2">
              <button onClick={addDemoTasks} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full font-bold transition text-xs">
                🧪 Demo
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transition flex items-center gap-2">
                <span>+</span> New Task
              </button>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden pb-4">
            <TaskColumn 
              title="TO DO" 
              count={todos.length} 
              color="bg-slate-500" 
              tasks={todos} 
              onTaskClick={setSelectedTask} 
            />
            <TaskColumn 
              title="IN PROGRESS" 
              count={doings.length} 
              color="bg-yellow-500" 
              tasks={doings} 
              onTaskClick={setSelectedTask} 
            />
            <TaskColumn 
              title="DONE" 
              count={dones.length} 
              color="bg-green-500" 
              tasks={dones} 
              onTaskClick={setSelectedTask} 
            />
          </div>
        </main>
      </div>
      
      <NewAdminTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={fetchTasks} 
      />
      <EditAdminTaskModal 
        isOpen={!!selectedTask} 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
        onUpdated={fetchTasks} 
      />
    </div>
  );
}