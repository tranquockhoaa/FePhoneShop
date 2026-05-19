import authorizedRequest from "../config/axios";

export const sendChatMessage = async (message) => {
  try {
    const response = await authorizedRequest.post("/chat/message", {
      message,
    });
    return response;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};
