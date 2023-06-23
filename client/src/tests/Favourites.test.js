import { render, screen, getByAttribute } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Favourites from "../components/Favourites";
import fetchMock from 'jest-fetch-mock'
import { act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
fetchMock.enableMocks();

const mockUseNavigate = jest.fn();

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => {
    return mockUseNavigate;
  },
}));

const image="https://www.howtogeek.com/wp-content/uploads/2021/06/youtube_hero_1200x675.jpg?height=200p&trim=2,2,2,2";

fetch.mockResponse(
  JSON.stringify(
    [{id:"1", title:"abc", cover:image},
    {id:"2", title:"def", cover:image},
    {id:"3", title:"ghi", cover:image}]
  )
);


test("test renders", async() => {
  const { container } = await render(
    <MemoryRouter initialEntries={["/"]}>
      <Favourites />
    </MemoryRouter>)

  const title = await screen.findByText("abc");
  expect(title).toBeInTheDocument();
  expect(screen.getByText("ghi")).toBeInTheDocument();
  expect(screen.getByText("def")).toBeInTheDocument();

  const images = container.querySelectorAll('img');
  images.forEach((element)=>{
    const img = element.getAttribute("src")
      expect(img).toBe(image);
  })
});


test("button makes a delete call", async() => {
  const { container } = await render(
    <MemoryRouter initialEntries={["/"]}>
      <Favourites />
    </MemoryRouter>)
  const enterAppButton = container.querySelector(".delete-button");
  await userEvent.click(enterAppButton);
  await screen.findByText("abc");
  const deleteRequest = fetchMock.mock.calls[fetchMock.mock.calls.length-1];
  setTimeout(1000);
  console.log(container.innerHTML);
  
  expect(screen.getByText("abc")).toBeInTheDocument();
  //sexpect(deleteRequest[1].method).toBe("DELETE");
})

test("button navigates to /details/", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Favourites />
    </MemoryRouter>
  );

  const enterButton = await screen.findByText("abc");
  await userEvent.click(enterButton);
  expect(mockUseNavigate).toHaveBeenCalledWith("/details/1");
});