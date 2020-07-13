import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // render the Application
    const { container } = render(<Application />);
    // make sure data is loaded
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // target the first appointment which is empty
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    // click the Add img
    fireEvent.click(getByAltText(appointment, "Add"));
    // change the student name input field value
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    // Select the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // click save
    fireEvent.click(getByText(appointment, "Save"));
    // check if mode was changed so the Status component is shown
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    // check if mode changed so the Show component with data is shown
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // target the DaylistItem that was effected, in this case monday
    const day = getAllByTestId(container, "day").find((day) =>
      getByText(day, "Monday")
    );
    // make sure the "... spots remaining" was updated
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // render Application
    const { container } = render(<Application />);
    // make sure data is loaded
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // target the Archie Cohen appointment
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    // click delete
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // check if the Confirm mode is shown
    expect(getByText(appointment, "Are you sure?")).toBeInTheDocument();
    // click confirm button
    fireEvent.click(queryByText(appointment, "Confirm"));
    // check if Status mode is shown with Deleting
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // wait until Deleting is done and element with "Add" is shown
    await waitForElement(() => getByAltText(appointment, "Add"));
    // target the Daylist item that was effected, in this case monday
    const day = getAllByTestId(container, "day").find((day) =>
      getByText(day, "Monday")
    );
    // make sure the "... spots remaining" was updated
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // render Application
    const { container } = render(<Application />);
    // make sure data is loaded
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // target the Archie Cohen appointment
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    // click Edit
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // change the student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Archie Cohen 2" },
    });
    // click Save
    fireEvent.click(getByText(appointment, "Save"));
    // check if mode was changed so the Status component is shown
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    // check if mode changed so the Show component with updated data is shown
    await waitForElement(() => getByText(appointment, "Archie Cohen 2"));
    // target the DaylistItem that was effected, in this case monday
    const day = getAllByTestId(container, "day").find((day) =>
      getByText(day, "Monday")
    );
    // make sure the "... spots remaining" stay the same
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
  it("shows the delete error when failing to delete an appointment", async () => {
    // handle delete call with rejection, only until delte is called once
    axios.delete.mockRejectedValueOnce();

    // render Application
    const { container } = render(<Application />);
    // make sure data is loaded
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // target the Archie Cohen appointment
    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find((appointment) => queryByText(appointment, "Archie Cohen"));
    // click delete
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // check if the Confirm mode is shown
    expect(getByText(appointment, "Are you sure?")).toBeInTheDocument();
    // click confirm button
    fireEvent.click(queryByText(appointment, "Confirm"));
    // check if Status mode is shown with Deleting
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // wait until Deleting is done and element with Error is shown
    await waitForElement(() => getByText(appointment, "Error"));
    // click the close img
    fireEvent.click(getByAltText(appointment, "Close"));
    // check if Show component is displayed
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  });
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // render the Application
    const { container } = render(<Application />);
    // make sure data is loaded
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // target the first appointment which is empty
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    // click the Add img
    fireEvent.click(getByAltText(appointment, "Add"));
    // change the student name input field value
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    // Select the interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // click save
    fireEvent.click(getByText(appointment, "Save"));
    // check if mode was changed so the Status component is shown
    expect(getByText(appointment, "SAVING")).toBeInTheDocument();
    // wait until Saving is done and element with Error is shown
    await waitForElement(() => getByText(appointment, "Error"));
    // click the close img
    fireEvent.click(getByAltText(appointment, "Close"));
    // check if Form is displayed
    expect(
      getByPlaceholderText(appointment, /enter student name/i)
    ).toBeInTheDocument();
  });
});
