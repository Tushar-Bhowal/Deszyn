import { ChatPanel } from './_components/chat-panel';
import { StudioProvider } from './_components/studio-provider';

export default function ProjectPage() {
  return (
    <StudioProvider>
      <ChatPanel />
    </StudioProvider>
  );
}
