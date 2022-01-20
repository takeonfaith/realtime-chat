import { Message } from "../../../shared/api/model/message";
import localizeDate from "../../../shared/lib/localize-date";

const prepareMessages = (messages: Message[]) => {
  const result = {} as {
    [key: number]: {
      avatar?: string;
      messages: Message[];
      date: string | null;
    };
  };
  let index = 0;
  let lastDate = "";

  messages.forEach((message, i, arr) => {
    if (
      arr[i - 1]?.sender._id !== message.sender._id ||
      localizeDate(arr[i - 1].createdAt) !== localizeDate(message.createdAt) ||
      !arr[i - 1]
    ) {
      index++;
    }

    if (result[index]) result[index].messages.push(message);
    else {
      result[index] = {
        messages: [message],
        avatar: "",
        date:
          localizeDate(message.createdAt) !== lastDate
            ? localizeDate(message.createdAt)
            : null,
      };

      lastDate = localizeDate(message.createdAt);
    }
  });

  return result;
};

export default prepareMessages;
