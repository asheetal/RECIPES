import { memo } from 'react';
import { MessagesSquare } from 'lucide-react';

type ConversationIconProps = {
  className?: string;
  size?: number;
};

function ConversationEndpointIcon({ className, size = 20 }: ConversationIconProps) {
  return <MessagesSquare className={className} size={size} strokeWidth={1.75} aria-hidden="true" />;
}

export default memo(ConversationEndpointIcon);
