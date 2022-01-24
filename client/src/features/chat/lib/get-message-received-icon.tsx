import { FiCheck, FiClock, FiX } from "react-icons/fi";

const getMessageReceivedIcon = (
  received: "pending" | "success" | "failure"
) => {
  switch (received) {
    case "success":
      return <FiCheck />;
    case "failure":
      return <FiX />;
    case "pending":
      return <FiClock />;
  }
};

export default getMessageReceivedIcon;
