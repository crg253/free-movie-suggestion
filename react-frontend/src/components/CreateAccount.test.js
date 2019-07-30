import CreateAccount from "./CreateAccount";

describe("<CreateAccount />", () => {
  //#1
  it("local state changes with form input", () => {
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
});
