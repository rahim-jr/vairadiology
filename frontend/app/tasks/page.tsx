import { Icon } from "@/components/shared/Icons";
import { AppNav } from "@/components/shared/AppNav";
import { DateSelector } from "@/components/shared/DateSelector";
import { Board } from "@/components/tasks/Board";

export default function TasksPage() {
  return (
    <main className="shell">
      <AppNav />
      <section className="page">
        <div className="toolbar">
          <div>
            <span className="eyebrow">
              <Icon name="activity" size={16} /> Daily execution room
            </span>
            <h1 className="page-title gradient-text">Nobody does the task</h1>
            <p className="subtitle">
              Pick a day, capture the work, then glide each task across a
              focused three-stage Kanban flow.
            </p>
          </div>
          <div className="toolbar-actions">
            <DateSelector />
          </div>
        </div>
        <Board />
      </section>
    </main>
  );
}
