import Menu from "./Menu";

function createTestPropsNoUser(props) {
  return {
    user: "",
    ...props
  };
}

function createTestPropsUser(props) {
  return {
    user: "monkey",
    ...props
  };
}

let propsNoUser, noUserWrapper, propsUser, userWrapper;

beforeEach(() => {
  propsNoUser = createTestPropsNoUser();
  noUserWrapper = shallow(<Menu {...propsNoUser} />);
  propsUser = createTestPropsUser();
  userWrapper = shallow(<Menu {...propsUser} />);
});

describe("<Menu />", () => {
  it("renders with no props", () => {
    noUserWrapper;
    expect(
      noUserWrapper.containsMatchingElement(<h2>Sign In</h2>)
    ).toBeTruthy();
    expect(
      noUserWrapper.containsMatchingElement(<h2>Recommend</h2>)
    ).toBeTruthy();
    expect(
      noUserWrapper.containsMatchingElement(<h2>User Suggestions</h2>)
    ).toBeTruthy();
    expect(noUserWrapper.containsMatchingElement(<h2>About</h2>)).toBeTruthy();
    expect(
      noUserWrapper.containsMatchingElement(<h2>Contact</h2>)
    ).toBeTruthy();
  });
});

describe("<Menu />", () => {
  it("renders with user name passed as props", () => {
    userWrapper;
    expect(
      userWrapper.containsMatchingElement(<h2>monkey's Movies</h2>)
    ).toBeTruthy();
    expect(
      userWrapper.containsMatchingElement(<h2>Recommend</h2>)
    ).toBeTruthy();
    expect(
      userWrapper.containsMatchingElement(<h2>User Suggestions</h2>)
    ).toBeTruthy();
    expect(userWrapper.containsMatchingElement(<h2>About</h2>)).toBeTruthy();
    expect(userWrapper.containsMatchingElement(<h2>Contact</h2>)).toBeTruthy();
    expect(
      userWrapper.containsMatchingElement(<p>edit account</p>)
    ).toBeTruthy();
    expect(
      userWrapper.containsMatchingElement(<p>delete account</p>)
    ).toBeTruthy();
    expect(userWrapper.containsMatchingElement(<p>sign out</p>)).toBeTruthy();
  });
});
