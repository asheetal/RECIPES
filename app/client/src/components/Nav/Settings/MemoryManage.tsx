import { useState } from 'react';
import { Button, OGDialog, OGDialogTrigger, OGDialogTemplate } from '@librechat/client';
import MemoryPanel from '~/components/SidePanel/Memories/MemoryPanel';

export default function MemoryManage() {
  const [open, setOpen] = useState(false);
  return <div className="flex items-center justify-between gap-3">
    <span>My persona</span>
    <OGDialog open={open} onOpenChange={setOpen}>
      <OGDialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Manage My persona">Manage</Button>
      </OGDialogTrigger>
      <OGDialogTemplate title="My persona" className="w-11/12 max-w-2xl"
        main={open ? <div className="max-h-[65vh] overflow-y-auto"><MemoryPanel /></div> : null}
      />
    </OGDialog>
  </div>;
}
