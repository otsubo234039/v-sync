"use client";
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

  // ★修正: 外側のLayoutコンポーネントを削除
  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      
      <header className="flex justify-between items-end mb-8 shrink-0">
        <div>
          <h2 className="text-xs font-bold tracking-widest mb-1 text-slate-500">PROJECT MANAGEMENT</h2>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">TASK BOARD</h1>
        </div>
        
        <div className="flex gap-3">
          <button onClick={addDemoTasks} className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg font-bold transition text-xs hover:bg-slate-200 dark:hover:bg-slate-700">
            Demo Data
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition active:scale-95 duration-75">
            New Task
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden pb-4">
        <TaskColumn title="TO DO" count={todos.length} color="bg-slate-500" tasks={todos} onTaskClick={setSelectedTask} />
        <TaskColumn title="IN PROGRESS" count={doings.length} color="bg-yellow-500" tasks={doings} onTaskClick={setSelectedTask} />
        <TaskColumn title="DONE" count={dones.length} color="bg-emerald-500" tasks={dones} onTaskClick={setSelectedTask} />
      </div>
      
      <NewAdminTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchTasks} />
      <EditAdminTaskModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchTasks} />
    </div>
  );
}