const getToken = () => {
  try {
    const account = JSON.parse(localStorage.getItem("account") || "{}");
    return account?.token || "";
  } catch (error) {
    console.error("Error parsing account from localStorage:", error);
    return "";
  }
};

export default getToken;
