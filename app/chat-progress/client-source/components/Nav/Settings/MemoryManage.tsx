import { useState } from 'react';
import { Button, OGDialog, OGDialogTrigger, OGDialogTemplate } from '@librechat/client';
import MemoryPanel from '~/components/SidePanel/Memories/MemoryPanel';

export default function MemoryManage() {
  const [open, setOpen] = useState(false);
  return <div className="flex items-center justify-between gap-3">
    <span>My Memory</span>
    <OGDialog open={open} onOpenChange={setOpen}>
      <OGDialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Manage My Memory">Manage</Button>
      </OGDialogTrigger>
      <OGDialogTemplate title="My Memory" className="w-11/12 max-w-2xl"
        main={open ? <div className="max-h-[65vh] overflow-y-auto"><MemoryPanel /></div> : null}
      />
    </OGDialog>
  </div>;
}
