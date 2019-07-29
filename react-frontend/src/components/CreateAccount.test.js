import CreateAccount from "./CreateAccount";

jest.mock("../services/fetchAddUser");

describe("<CreateAccount />", () => {
  //#1
  it("local state responds to form input changes", () => {
    const wrapper = shallow(<CreateAccount />);

    wrapper
      .find("#create-account-username-input")
      .simulate("change", {target: {value: "monkey"}});

    expect(wrapper.state("Name")).toEqual("monkey");

    wrapper
      .find("#create-account-password-input")
      .simulate("change", {target: {value: "monkeypassword"}});

    expect(wrapper.state("Password")).toEqual("monkeypassword");

    wrapper
      .find("#create-account-email-input")
      .simulate("change", {target: {value: "monkey@cat.com"}});

    expect(wrapper.state("Email")).toEqual("monkey@cat.com");
  });

  //#2
  it("local state clears after mock fetchAddUser 200 response code", async () => {
    const wrapper = shallow(<CreateAccount />);

    wrapper.setState({
      Name: "monkey",
      Password: "monkeypassword",
      Email: "monkey@cat.com"
    });

    await wrapper.instance().handleAddUserSubmit();
    await wrapper.update();
    expect(wrapper.state("Email")).toEqual("");
  });
});
