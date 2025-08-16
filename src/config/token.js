const getToken = () => {
  try {
    const token = localStorage.getItem("token") || "{}";
    return token || "";
  } catch (error) {
    console.error("Error parsing token from localStorage:", error);
    return "";
  }
};

export default getToken;
