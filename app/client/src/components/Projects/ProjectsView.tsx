import { serverLocaleDate } from '~/utils/serverTime';
import { useDeferredValue, useEffect, useId, useMemo, useState } from 'react';
import * as Ariakit from '@ariakit/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Check, Ellipsis, Folder, Plus, Search } from 'lucide-react';
import { Input, Button, Spinner, DropdownPopup, useMediaQuery } from '@librechat/client';
import type { TChatProject } from 'librechat-data-provider';
import type { MenuItemProps, RenderProp } from '~/common';
import OpenSidebar from '~/components/Chat/Menus/OpenSidebar';
import { useProjectsInfiniteQuery } from '~/data-provider';
import ProjectCreateDialog from './ProjectCreateDialog';
import {
  ProjectRenameDialog,
  ProjectDeleteDialog,
} from '~/components/Conversations/ProjectsSection';
import { useLocalize } from '~/hooks';
import { cn } from '~/utils';

type ProjectSort = 'name' | 'createdAt' | 'lastConversationAt';

function renderSortMenuItem(label: string, isSelected: boolean): RenderProp {
  return function SortMenuItem({ className, ...props }) {
    return (
      <div {...props} className={cn(className, 'justify-between gap-5')}>
        <span className="truncate">{label}</span>
        {isSelected ? (
          <Check className="h-4 w-4 shrink-0 text-text-primary" aria-hidden="true" />
        ) : (
          <span className="h-4 w-4 shrink-0" aria-hidden="true" />
        )}
      </div>
    );
  };
}

function formatActivity(project: TChatProject) {
  const value = project.lastConversationAt ?? project.updatedAt ?? project.createdAt;
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return serverLocaleDate(date, undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function ProjectTile({
  project,
  activity,
  onOpen,
}: {
  project: TChatProject;
  activity: string | null;
  onOpen: () => void;
}) {
  const localize = useLocalize();
  const menuId = useId();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const menuItems = useMemo<MenuItemProps[]>(
    () => [
      {
        id: 'rename',
        label: localize('com_ui_rename'),
        icon: null,
        onClick: () => setIsRenameOpen(true),
      },
      {
        id: 'delete',
        label: localize('com_ui_delete'),
        icon: null,
        onClick: () => setIsDeleteOpen(true),
      },
    ],
    [localize],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        'group/project relative flex min-h-[8.5rem] cursor-pointer flex-col rounded-xl border border-border-medium bg-surface-secondary p-4 text-left transition-colors',
        'hover:border-border-heavy hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary',
      )}
    >
      <span className="flex min-w-0 items-center gap-2 pr-8">
        <Folder className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
        <span className="truncate text-base font-semibold text-text-primary">{project.name}</span>
      </span>

      <div
        className="absolute right-2 top-2"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <DropdownPopup
          portal={true}
          focusLoop={true}
          unmountOnHide={true}
          menuId={menuId}
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          className="z-[125] min-w-40"
          iconClassName="mr-2 text-text-secondary"
          trigger={
            <Ariakit.MenuButton
              aria-label={localize('com_ui_more_options')}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors',
                'hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary',
                isMenuOpen && 'bg-surface-active-alt text-text-primary',
              )}
            >
              <Ellipsis className="h-4 w-4" aria-hidden="true" />
            </Ariakit.MenuButton>
          }
          items={menuItems}
        />
      </div>

      {project.description ? (
        <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {project.description}
        </span>
      ) : null}

      <span className="mt-auto flex items-center justify-between gap-2 pt-4 text-xs text-text-secondary">
        <span>
          {project.conversationCount === 1
            ? localize('com_ui_project_chat_count_single')
            : localize('com_ui_project_chat_count', { count: project.conversationCount })}
        </span>
        {activity ? <span className="shrink-0 truncate">{activity}</span> : null}
      </span>

      <ProjectRenameDialog
        open={isRenameOpen}
        onOpenChange={setIsRenameOpen}
        project={project}
      />
      <ProjectDeleteDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        project={project}
      />
    </div>
  );
}

export default function ProjectsView() {
  const localize = useLocalize();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<ProjectSort>('lastConversationAt');
  const [isCreating, setIsCreating] = useState(searchParams.get('new') === '1');
  const sortMenuId = useId();
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const deferredSearch = useDeferredValue(search);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const { data, fetchNextPage, isFetchingNextPage, isLoading } = useProjectsInfiniteQuery({
    search: deferredSearch || undefined,
    sortBy,
    sortDirection: sortBy === 'name' ? 'asc' : 'desc',
  });

  const projects = useMemo(() => data?.pages.flatMap((page) => page.projects) ?? [], [data?.pages]);
  const hasNextPage = data?.pages[data.pages.length - 1]?.nextCursor != null;
  const sortOptions = useMemo(
    () => [
      { value: 'lastConversationAt' as const, label: localize('com_ui_latest_activity') },
      { value: 'createdAt' as const, label: localize('com_ui_sort_created') },
      { value: 'name' as const, label: localize('com_ui_name') },
    ],
    [localize],
  );
  const selectedSortLabel =
    sortOptions.find((option) => option.value === sortBy)?.label ??
    localize('com_ui_latest_activity');
  const sortMenuItems = useMemo<MenuItemProps[]>(
    () =>
      sortOptions.map((option) => {
        const isSelected = sortBy === option.value;
        return {
          id: `project-sort-${option.value}`,
          ariaLabel: option.label,
          ariaChecked: isSelected,
          onClick: () => setSortBy(option.value),
          render: renderSortMenuItem(option.label, isSelected),
        };
      }),
    [sortBy, sortOptions],
  );

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setIsCreating(true);
    }
  }, [searchParams]);

  const handleCreateDialogChange = (open: boolean) => {
    setIsCreating(open);
    if (!open && searchParams.get('new') === '1') {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('new');
      setSearchParams(nextParams, { replace: true });
    }
  };

  return (
    <main className="flex h-full min-h-0 flex-col overflow-auto bg-surface-primary text-text-primary">
      <div className="container mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {isSmallScreen ? <OpenSidebar /> : null}
            <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              {localize('com_ui_projects')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-text-secondary sm:inline">
              {localize('com_ui_sort_by')}
            </span>
            <DropdownPopup
              portal={true}
              focusLoop={true}
              unmountOnHide={true}
              menuId={sortMenuId}
              isOpen={isSortMenuOpen}
              setIsOpen={setIsSortMenuOpen}
              className="z-[125] min-w-56"
              trigger={
                <Ariakit.MenuButton
                  aria-label={localize('com_ui_sort_projects_by')}
                  className={cn(
                    'inline-flex h-10 items-center justify-between gap-2 whitespace-nowrap rounded-lg border border-border-medium bg-surface-secondary px-3 text-sm font-medium text-text-primary transition-colors hover:bg-surface-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-primary disabled:pointer-events-none disabled:opacity-50 sm:w-44',
                    isSortMenuOpen && 'bg-surface-hover text-text-primary',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <ArrowUpDown
                      className="h-4 w-4 shrink-0 text-text-secondary"
                      aria-hidden="true"
                    />
                    <span className="truncate">{selectedSortLabel}</span>
                  </span>
                </Ariakit.MenuButton>
              }
              items={sortMenuItems}
            />
            <Button type="button" variant="submit" size="sm" onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {localize('com_ui_new_project')}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{localize('com_ui_search_projects')}</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={localize('com_ui_search_projects')}
              className="border-border-medium bg-surface-secondary pl-9 text-text-primary placeholder:text-text-secondary focus-visible:ring-2 focus-visible:ring-ring-primary"
            />
          </label>
          <div className="flex items-center">
            <span className="rounded-full bg-surface-active-alt px-4 py-2 text-sm font-medium text-text-primary">
              {localize('com_ui_your_projects')}
            </span>
          </div>
        </div>

        <ProjectCreateDialog
          open={isCreating}
          onOpenChange={handleCreateDialogChange}
          onCreated={(project) => navigate(`/projects/${project._id}`)}
        />

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="text-text-primary" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            {projects.map((project) => (
              <ProjectTile
                key={project._id}
                project={project}
                activity={formatActivity(project)}
                onOpen={() => navigate(`/projects/${project._id}`)}
              />
            ))}
          </div>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="rounded-lg border border-border-medium bg-transparent py-16 text-center text-sm text-text-secondary">
            {localize('com_ui_no_projects')}
          </div>
        )}

        {hasNextPage && (
          <Button
            type="button"
            variant="outline"
            className="mx-auto"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? localize('com_ui_loading') : localize('com_ui_load_more')}
          </Button>
        )}
      </div>
    </main>
  );
}
