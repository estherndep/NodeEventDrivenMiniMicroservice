import React from "react";

const CommentList = ({ comments }) => {

  const renderedComments = comments.map((comment) => {
    switch (comment.status) {
      case 'pending':
        comment.content = 'pending comment'
        break
      case 'approved':
        break
      case 'rejected':
        comment.content = 'rejected comment'
      break
      default:
        comment.content = 'awaiting moderation'
        break;
    }
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
