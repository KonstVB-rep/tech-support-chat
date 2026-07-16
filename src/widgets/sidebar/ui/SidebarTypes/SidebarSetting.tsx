
import SidebarContent from './SidebarContent';

export const SideBarSettings = () => {
  return (
      <div className="p-4 border-b border-border bg-muted/10 flex-1">
          <h2 className="font-bold text-lg tracking-tight flex gap-2 items-center justify-between"><span className="uppercase">настройки</span></h2>
              
          <SidebarContent.Settings />

      </div>
  )
}

