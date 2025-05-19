

import CommentLayout from "@/components/comment-layout"

interface CommentLayoutProps {
  id: string;
  resetKey?: boolean
}

export default function Comment({ id, resetKey }: CommentLayoutProps) {
  return(
    <CommentLayout id={id} resetKey={resetKey}/>
  )
}
