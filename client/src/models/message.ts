export interface Message {
  id: string;
  slackId: string;
  text: string;
  userId: string;
  displayName: string;
  userPicturePath: string;
  files: File[]
  channel: string;
  postedDate: string;
  modifiedDate: string;
}

export interface File {
  id: string;
  title: string;
  picturePath: string;
}