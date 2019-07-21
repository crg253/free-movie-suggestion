import CreateAccount from "./CreateAccount";

describe("<CreateAccount />", () => {
  it("form input changes in local state", () => {
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
