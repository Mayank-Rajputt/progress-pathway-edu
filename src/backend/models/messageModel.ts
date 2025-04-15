
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  subject: string;
  content: string;
  isRead: boolean;
  attachments?: string[];
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required']
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    isRead: {
      type: Boolean,
      default: false
    },
    attachments: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);
