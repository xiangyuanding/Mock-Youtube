import { render, screen, getByAttribute } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../components/Profile";
import { enableFetchMocks } from "jest-fetch-mock";
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


enableFetchMocks();

jest.mock("@auth0/auth0-react", () => ({
  ...jest.requireActual("@auth0/auth0-react"),
  Auth0Provider: ({ children }) => children,
  useAuth0: () => {
    return {
      isLoading: false,
      isAuthenticated: true,
      user: {
        sub: "subId",
        name: "Tom",
        email: "xiangyuanding@gmail.com",
        email_verified: true,
      },
      isAuthenticated: true,
      loginWithRedirect: jest.fn(),
    };
  },
}));

jest.mock("../AuthToken", () => ({
  useAuthToken: () => {
    return { accessToken: "123" };
  },
}));

fetch.mockResponse(
  JSON.stringify(
    { id: 1, auth0Id: "subId", email: "xiangyuanding@gmail.com", name:"Tom", description:"", favourites:[], subscription:[]},
  )
);


 test("test renders", async() => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>)

  const tom = await screen.findByText("Tom");
  expect(screen.getByText("User name:")).toBeInTheDocument();
  expect(tom).toBeInTheDocument();
  expect(screen.getByText("Email: xiangyuanding@gmail.com")).toBeInTheDocument();
  expect(screen.getByText("auth0Id: subId")).toBeInTheDocument();
  expect(screen.getByText("Description:")).toBeInTheDocument();
});

test("button works", async() => {
  const { container } = render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>)
    
  const enterAppButton = await screen.findByText("edit🖊");
  await userEvent.click(enterAppButton);
  expect(screen.getByText("Done✔")).toBeInTheDocument();
  expect(container.querySelector('.editable')).toHaveAttribute("contenteditable");
})
