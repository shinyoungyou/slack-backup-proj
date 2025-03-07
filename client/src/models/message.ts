export interface Message {
  id: string;
  slackId: string;
  text: string;
  userId: string;
  displayName: string;
  userPicturePath: string;
  channel: string;
  postedDate: Date;
  modifiedDate: Date | null;
}