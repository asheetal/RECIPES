import ProjectUploadFiles from '~/components/Projects/ProjectUploadFiles';
export default function ProjectFilesPanel({ projectId }: { projectId: string }) {
  return <ProjectUploadFiles projectId={projectId} embedded confirmReplacement />;
}
