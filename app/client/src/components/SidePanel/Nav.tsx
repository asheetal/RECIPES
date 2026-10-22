import CrashAdmin from '~/components/UnifiedSidebar/CrashAdmin';
import '~/utils/crashReporter';
import ResourceUsage from '~/components/UnifiedSidebar/ResourceUsage';
import { useAuthContext } from '~/hooks/AuthContext';
import type { NavLink } from '~/common';
import { useActivePanel, resolveActivePanel } from '~/Providers';

export default function Nav({ links }: { links: NavLink[] }) {
  const { active } = useActivePanel();
  const { user } = useAuthContext();
  if(active==='crashes' && user?.role==='ADMIN')return <CrashAdmin />;
  if(active==='resources' && user?.role==='ADMIN')return <ResourceUsage />;
  const effectiveActive = resolveActivePanel(active, links);
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto overflow-x-hidden text-text-primary">
      {links.map((link) =>
        link.id === effectiveActive && link.Component ? <link.Component key={link.id} /> : null,
      )}
    </div>
  );
}
