import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Profile from "../components/Profile";
import { enableFetchMocks } from "jest-fetch-mock";
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
  ...jest.requireActual("../AuthToken"),
  useAuthToken: ()=>{
    return{
      accessToken: "12345",
    }
  }
}));

fetch.mockResponse(
  JSON.stringify([
    { id: 1, auth0Id: "subId", name:"Tom", description:"", completed: false },
  ])
);


test("renders Profile", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Profile />
    </MemoryRouter>
  );

  expect(screen.getByText("Name:")).toBeInTheDocument();
  expect(screen.getByText("Tom")).toBeInTheDocument();
  expect(screen.getByText("Email: xiangyuanding@gmail.com")).toBeInTheDocument();
  expect(screen.getByText("auth0Id: subId")).toBeInTheDocument();
  expect(screen.getByText("Description:")).toBeInTheDocument();
});
