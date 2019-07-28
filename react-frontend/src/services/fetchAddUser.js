const fetchAddUser = (userName, password, email) => {
  const response = fetch("/api/adduser", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      userName: userName,
      password: password,
      email: email
    })
  });
  return response;
};

export default fetchAddUser;
