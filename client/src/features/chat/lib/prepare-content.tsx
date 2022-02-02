import { Chat, IUser } from "../../../shared/api/model";
import { Message } from "../../../shared/api/model/message";
import { MessageLink } from "../ui";

const prepareContent = (
  value: string,
  message: Message,
  selectedChat: Chat | null,
  user: IUser | null
) => {
  const words = value.split(/\s/g);
  let result: React.ReactNode[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.includes("@") || word.includes("#") || word.includes("http")) {
      if (word[word.length - 1] !== ",") {
        result.push(
          <MessageLink
            text={word}
            isYourMessage={user?._id === message.sender._id}
            user={selectedChat?.users.find((user) => "@" + user.login === word)}
            isRealLink={word.includes("http")}
          />
        );
      } else {
        result.push(
          <MessageLink
            text={word.substring(0, word.length - 1)}
            isYourMessage={user?._id === message.sender._id}
            user={selectedChat?.users.find(
              (user) => "@" + user.login === word.substring(0, word.length - 1)
            )}
            isRealLink={word.includes("http")}
          />
        );
      }
    } else result.push(" " + word);
  }
  return result;
};

export default prepareContent;
